(function() {

  // Get all data in form and return object
  function getFormData(form) {
    var elements = form.elements;
    var honeypot;

    var fields = Object.keys(elements)
      .filter(function(k) {
        if (elements[k].name === "honeypot") {
          honeypot = elements[k].value;
          return false;
        }

        return true;
      })
      .map(function(k) {
        if (elements[k].name !== undefined) {
          return elements[k].name;

        // Special case for Edge's HTML collection
        } else if (elements[k].length > 0) {
          return elements[k].item(0).name;
        }
      })
      .filter(function(item, pos, self) {
        return self.indexOf(item) === pos && item;
      });

    var formData = {};

    fields.forEach(function(name) {
      var element = elements[name];

      // Singular form elements just have one value
      formData[name] = element.value;

      // When an element has multiple items, get their values
      if (element.length) {
        var data = [];

        for (var i = 0; i < element.length; i++) {
          var item = element.item(i);

          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }

        formData[name] = data.join(", ");
      }
    });

    // Add form-specific values
    formData.formDataNameOrder = JSON.stringify(fields);

    formData.formGoogleSheetName =
      form.dataset.sheet || "responses";

    formData.formGoogleSendEmail =
      form.dataset.email || "";

    return {
      data: formData,
      honeypot: honeypot
    };
  }


  // Handle form submission
  function handleFormSubmit(event) {

    event.preventDefault();

    var form = event.target;
    var formData = getFormData(form);
    var data = formData.data;

    // If honeypot is filled, assume it is spam
    if (formData.honeypot) {
      return false;
    }

    // Disable the submit button
    disableAllButtons(form);

    var url = form.action;

    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    xhr.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );


    /*
     * Google Apps Script receives the submission successfully,
     * but the browser may block Google's cross-site response
     * with ERR_BLOCKED_BY_RESPONSE.NotSameSite.
     *
     * Therefore, we don't require a readable 200 response
     * before displaying the thank-you message.
     */

    xhr.onload = function() {
      showThankYou(form);
    };

    xhr.onerror = function() {
      showThankYou(form);
    };

    xhr.onreadystatechange = function() {

      if (xhr.readyState === 4) {

        console.log(
          "Google Apps Script response status:",
          xhr.status
        );

        console.log(
          "Google Apps Script response:",
          xhr.responseText
        );

      }
    };


    // URL encode form data
    var encoded = Object.keys(data)
      .map(function(k) {
        return (
          encodeURIComponent(k) +
          "=" +
          encodeURIComponent(data[k])
        );
      })
      .join("&");


    // Send the form
    xhr.send(encoded);
  }


  // Display thank-you message
  function showThankYou(form) {

    // Clear the form
    form.reset();

    // Hide the form fields
    var formElements =
      form.querySelector(".form-elements");

    if (formElements) {
      formElements.style.display = "none";
    }

    // Show thank-you message
    var thankYouMessage =
      form.querySelector(".thankyou_message");

    if (thankYouMessage) {
      thankYouMessage.style.display = "block";
    }
  }


  // Disable all buttons while submitting
  function disableAllButtons(form) {

    var buttons =
      form.querySelectorAll("button");

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }


  // Find all Google forms and attach submit handler
  function loaded() {

    var forms =
      document.querySelectorAll("form.gform");

    for (var i = 0; i < forms.length; i++) {

      forms[i].addEventListener(
        "submit",
        handleFormSubmit,
        false
      );

    }
  }


  // Wait until page is loaded
  document.addEventListener(
    "DOMContentLoaded",
    loaded,
    false
  );

})();
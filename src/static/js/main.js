// https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
    "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

// https://stackoverflow.com/a/2507043/5956579
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

// end helper functions

// init the main page's input box
function initWebsiteInput() {
  let button = $("#website-submit");
  let input = $("#website-input");

  input.keypress(function (e) {
    if (e.which == 13) {
      //Enter key pressed
      button.click(); //Trigger search button click event
    }
  });
  button.click(function () {
    submitWebsite(input);
  });
}

// submit the main pages input box and invoke modal
function submitWebsite(input) {
  let websiteURL = input.val();
  let modalWebsiteHiddenInput = $("#modal-website");
  let mainPageMessage = $("#response-placeholder");

  // clear error response
  mainPageMessage.html("");

  if (isValidUrl(websiteURL)) {
    // set data attribute in modal
    modalWebsiteHiddenInput.attr("data-website", websiteURL);
    // show modal
    $("#modal-02").modal("show");
    $("#modal-email").focus();
    // clear the original input
    input.val("");
    // init email
    initModalSubmitEmail();
  } else {
    mainPageMessage.html("Invalid website url, try entering a new one");
  }
}

// init the modal's input box
function initModalSubmitEmail() {
  let button = $("#modal-submit");
  let input = $("#modal-email");

  input.keypress(function (e) {
    if (e.which == 13) {
      //Enter key pressed
      button.click(); //Trigger search button click event
    }
  });
  button.click(function () {
    submitUser(input);
  });
}

// submit the modal input box and call backend
function submitUser(input) {
  let email = input.val();
  let website = $("#modal-website").attr("data-website");

  let modalMessage = $("#modal-response-placeholder");

  $("#modal-submit").addClass("disabled");

  if (isEmail(email)) {
    let payload = {
      email: email,
      website: website,
    };

    $.ajax({
      method: "POST",
      url: "/v1/api/user",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
      success: function (resp) {
        console.log(resp);
        if (resp.ok) {
          modalMessage.html(
            `ruff! expect an email shortly. meanwhile, check <a href='https://collie.ai/${resp.response}'>https://collie.ai/${resp.response}</a> for progress.`
          );

          // setTimeout(function () {
          //   $("#modal-submit").removeClass("disabled");
          //   $("#modal-02").modal("hide");
          // }, 2000);
        } else {
          modalMessage.html(resp.message);
          $("#modal-submit").removeClass("disabled");
        }
      },
      error: function (resp) {
        modalMessage.html(resp.message);
        $("#modal-submit").removeClass("disabled");
      },
    });
  } else {
    modalMessage.html("invalid email, try entering a new one");
    $("#modal-submit").removeClass("disabled");
  }
}

function clearModal() {
  $("#modal-website").attr("data-website", "");
  $("#modal-email").val("");
  $("#modal-response-placeholder").html("");
  $("#modal-submit").unbind();
  $("#modal-email").unbind();
}

$(document).ready(function () {
  initWebsiteInput();

  // on modal hide
  $("#modal-02").on("hide.bs.modal", function () {
    clearModal();
  });

  new CollieWidget({
    api_key: "sk_vVjlMnj9c_xSA7Q1ezsVGa5lVQKiAb5N4Lw7D4C9gIfWnJfCrpNoEXmA07mPUdTeKj0",
    div_id: "search-widget",
    suggested_pages: [
      {
        title: "Homepage",
        url: "https://collie.ai",
      },
    ],
  });
});

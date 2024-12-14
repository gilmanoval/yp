const ReCAPTCHA = require('react-google-recaptcha');

function onChange(value) {
  console.log("Captcha value:", value);
}

ReactDOM.render(
  <ReCAPTCHA
    sitekey="6LcBQZsqAAAAAH6l9ctjsmM2-f-6Qgct_Zrh1C18"
    onChange={onChange}
  />,
  document.body
);
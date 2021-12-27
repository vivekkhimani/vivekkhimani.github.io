<?php
  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */

  // Replace contact@example.com with your real receiving email address
  // $receiving_email_address = 'vivekkhimani07@gmail.com';

  // if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
  //   include( $php_email_form );
  // } else {
  //   die( 'Unable to load the "PHP Email Form" Library!');
  // }

  //$contact = new PHP_Email_Form;
  //$contact->ajax = true;
  
  // $to = $receiving_email_address;
  // $from_name = $_POST['name'];
  // $from_email = $_POST['email'];
  // $subject = $_POST['subject'];
  // $message = $_POST['message'];

  // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
  /*
  $contact->smtp = array(
    'host' => 'example.com',
    'username' => 'example',
    'password' => 'pass',
    'port' => '587'
  );
  */

  // $body = "From: $from_name\n E-Mail: $from_email\n Subject:\n $subject\n Message:\n $message";

  // if ($_POST['submit']) {
  //   if (mail ($to, $subject, $body, $from)) {
  //     echo '<p>Your message has been sent!</p>';
  //   } else {
  //     echo '<p>Something went wrong! Try again!</p>';
  //   }
  // }

  //echo $contact->send();
?>

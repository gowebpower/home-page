<?php

    $response = array( 'success' => false );
    $formData = file_get_contents( 'php://input' );
    $data = json_decode( $formData );
    
    $name = $data->name;
    $phone = $data->phone;
    $email = $data->email;
    $message = $data->comment;

    if ( $name != '' && $email != '' && $message != '' ) {
        $mailTo = 'yooinsj@gmail.com';
        $subject = 'New contact form submission';
        $body  = 'From: ' . $name . "\n";
        $body .= 'Phone: ' . $phone . "\n";
        $body .= 'Email: ' . $email . "\n";
        $body .= "Message:\n" . $message . "\n\n";

        $success = mail( $mailTo, $subject, $body );

        if ( $success ) {
            $response[ 'success' ] = true;
        }
    }

    echo json_encode( $response );

?>






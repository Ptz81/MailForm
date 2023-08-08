<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

$mail->Charset = 'UTF-8';
$mail->setLanguage("uk", 'phpmailer/language/');

//від кого
    $mail->setFrom('info@fls.com', 'Mailer');
    //кому відправити
    $mail->addAddress('joe@fls.net', 'Joe User');     

    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Hi everybody!';

    $body = '<h1>This is message from <b>FormData!</b></h1>';

    $gender = 'male';
    if($_POST['gender']=="female"){
        $gender = 'female';
    }

//перевірка чи не пусте поле. Якщо не пусте, до вставляємо параграф з текстом
    if(trim(!empty($_POST['name']))){
        $body.='<p><strong>Name:</strong> '.$_POST['name'].'</p>';
    }
        if(trim(!empty($_POST['email']))){
        $body.='<p><strong>Email:</strong> '.$_POST['email'].'</p>';
    }
        if(trim(!empty($_POST['gender']))){
        $body.='<p><strong>Gender:</strong> '.$gender.'</p>';
    }
        if(trim(!empty($_POST['message']))){
        $body.='<p><strong>Message:</strong> '.$_POST['message'].'</p>';
    }
        if(trim(!empty($_POST['age']))){
        $body.='<p><strong>Age:</strong> '.$_POST['age'].'</p>';
    }
    //прикріпити файл
    if(!empty($_FILES['image']['tmp_name'])){
        //шлях завантаження
        $fileAttach = _DIR_."/files/" . $_FILES['image']['name'];
//вантажимо файл
        if(copy($_FILES['image']['tmp_name'], $filePath)){
            $fileAttach=$filePath;
               $body.='<p><strong>Photo:</strong></p>';
        $mail->addAttachment($fileAttach);
        }
     
    }
    //зібрали у плагін body
    $mail->Body = $body;

    //відправляємо
    if(!$mail->send()){
        $message = 'Error during sending';
    }else{
        $message = 'Data has been sent!';
    }
    $response = ['message'=>$message];
    header('Content-type: application/json');
    echo json_encode($response);
    ?>
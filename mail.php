<?php
	require( 'autoload.php' );

	if($_SERVER["REQUEST_METHOD"] == "POST") {
		$lang = "es";
		$resp = null;
		$error = null;
		$recaptcha = new \ReCaptcha\ReCaptcha("6LdwNxAUAAAAAG6bgz3BFH1l0HZS5UoFlq980x--");
      	
		if (isset($_POST['g-recaptcha-response'])) {
		    $resp = $recaptcha->verify($_POST['g-recaptcha-response'], $_SERVER['REMOTE_ADDR']);
		}

		if ($resp->isSuccess()) {
			// Obtenemos los campos y eleminamos los espacios blancos
			$nombre  = strip_tags(trim($_POST["nombre"]));
			$nombre  = str_replace(array("\r", "\n"), array("", ""), $nombre);
			$correo  = filter_var(trim($_POST["correo"]), FILTER_SANITIZE_EMAIL);
			$mensaje = trim($_POST["mensaje"]);

			//Verificamos que no falte ningun campo
			if (empty($nombre)  OR
				empty($correo)  OR
				empty($mensaje) OR
				!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
				http_response_code(400);

				echo "Lo sentimos, hubo un problema con el mensaje que mandaste, por favor trata de nuevo.";
				exit;
			}
			// Se define el destinatario
			$destinatario = "roni@viajesexcelsior.com.mx";

			// Se construye el mensaje de correo
			$sujeto = "Solicitud de información de " . $nombre . "\n";

            $mensaje_correo = null;
			$mensaje_correo .= "Nombre: " . $nombre . "\n";
 			$mensaje_correo .= "Correo: " . $correo . "\n";
			$mensaje_correo .= "Mensaje:\n" . $mensaje . "\n";

            $headers = array("From: " . $destinatario,
                "Reply-To: " . $correo,
                "X-Mailer: PHP/" . PHP_VERSION
            );
            $headers = implode("\r\n", $headers);

			if (mail($destinatario, $sujeto, $mensaje_correo, $headers)) {
				http_response_code(200);

				echo "Gracias por mandar tus dudas y comentarios.";
				exit;
			} else {
				http_response_code(500);

				echo "Lo sentimos, hubo un problema con el mensaje que mandaste.";
				exit;
			}
		} else {
			http_response_code(403);

			echo "Lo sentimos, hubo un problema con el mensaje que mandaste, por favor trata de nuevo.";
		}
	}
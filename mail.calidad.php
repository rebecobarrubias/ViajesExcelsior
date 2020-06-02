<?php
	require( 'autoload.php' );

	if( $_SERVER[ "REQUEST_METHOD" ] == "POST" ) {
		$lang = "es";
		$resp = null;
		$error = null;
		$recaptcha = new \ReCaptcha\ReCaptcha( "6LdwNxAUAAAAAG6bgz3BFH1l0HZS5UoFlq980x--" );
      	
		if ( isset( $_POST[ 'g-recaptcha-response'] ) ) {
		    $resp = $recaptcha -> verify( $ _POST[ "g-recaptcha-response" ], $_SERVER[ "REMOTE_ADDR" ] );
		}

        function procesarCampo( $campo ) {
            return str_replace( array( "\r", "\n" ), array( "", "" ), strip_tags( trim( $campo ) ) );
        }

        function calificacionAtencion( $valor ) {
            $mensajeCal = "";

            switch( $atencion ) {
                case "1":
                    $mensajeCal = "Muy bien";
                    break;
                case "2":
                    $mensajeCal = "Bien";
                    break;
                case "3":
                    $mensajeCal = "Mala";
                    break;
                case "0":
                default:
                    $mensajeCal = "Excelente";
            }

            return $mensajeCal;
        }

		if ( $resp -> isSuccess() ) {
			// Obtenemos los campos y eleminamos los espacios blancos
			$nombre       = procesarCampo( $_POST[ "nombre" ] );
            $empresa      = procesarCampo( $_POST[ "empresa" ] );
            $ejecutivo    = procesarCampo( $_POST[ "ejecutivo" ] );
			$atencion     = calificacionAtencion( trim( $_POST[ "atencion" ] ) );
            $conocimiento = calificacionAtencion( trim( $_POST[ "conocimiento" ] ) );
			$comentario   = trim( $_POST[ "comentario" ] );

			//Verificamos que no falte ningun campo
			if ( empty( $nombre )       OR
				 empty( $empresa )      OR
				 empty( $ejecutivo )    OR
                 empty( $atencion )     OR
                 empty( $conocimiento ) OR
                 empty( $comentario ) { 
                     http_response_code(400);
                     echo "Lo sentimos, hubo un problema con el mensaje que mandaste, por favor trata de nuevo.";
                     
                     exit;
            }

			// Se define el destinatario
			$destinatario = "atencion@viajesexcelsior.com.mx";

			// Se construye el mensaje de correo
			$sujeto = "Opinión de calidad de " . $nombre . "\n";

            $mensaje_correo = null;
			$mensaje_correo .= "Nombre: "       . $nombre       . "\n";
 			$mensaje_correo .= "Empresa: "      . $empresa      . "\n";
            $mensaje_correo .= "Ejecutivo: "    . $ejecutivo    . "\n";
            $mensaje_correo .= "Atención: "     . $atencion     . "\n";
            $mensaje_correo .= "Conocimiento: " . $conocimiento . "\n";
			$mensaje_correo .= "Comentario:\n"  . $comentario   . "\n";

            $headers = array( "From: " . $destinatario,
                "Reply-To: " . $destinatario,
                "X-Mailer: PHP/" . PHP_VERSION
            );
            $headers = implode( "\r\n", $headers );

			if ( mail( $destinatario, $sujeto, $mensaje_correo, $headers ) ) {
				http_response_code( 200 );

				echo "Gracias por mandar tus dudas y comentarios.";
				exit;
			} else {
				http_response_code( 500 );

				echo "Lo sentimos, hubo un problema con el mensaje que mandaste.";
				exit;
			}
		} else {
			http_response_code( 403 );

			echo "Lo sentimos, hubo un problema con el mensaje que mandaste, por favor trata de nuevo.";
		}
	}
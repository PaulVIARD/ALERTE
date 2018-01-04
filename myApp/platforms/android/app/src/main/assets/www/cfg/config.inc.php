<?php

// LDAP variables
$ldaphost = "annuaire.test.inetpsa.com";  // votre serveur LDAP
$ldapport = 389;                 // votre port de serveur LDAP

// Connexion LDAP
$ldapconn = ldap_connect($ldaphost, $ldapport)
          or die("Impossible de se connecter au serveur LDAP $ldaphost");

?>


// Eléments d'authentification LDAP
$ldaprdn  = 'uname';     // DN ou RDN LDAP
$ldappass = 'password';  // Mot de passe associé

// Connexion au serveur LDAP
$ldapconn = ldap_connect("ldap.example.com")
    or die("Impossible de se connecter au serveur LDAP.");

if ($ldapconn) {

    // Connexion au serveur LDAP
    $ldapbind = ldap_bind($ldapconn, $ldaprdn, $ldappass);

    // Vérification de l'authentification
    if ($ldapbind) {
        echo "Connexion LDAP réussie...";
    } else {
        echo "Connexion LDAP échouée...";
    }

}


// Connexion anonyme à un serveur LDAP

// Connexion au serveur LDAP
$ldapconn = ldap_connect("ldap.example.com")
    or die("Impossible de se connecter au serveur LDAP.");

if ($ldapconn) {

    // Authentification anonyme
    $ldapbind = ldap_bind($ldapconn);

    if ($ldapbind) {
        echo "Connexion LDAP anonmye réussie...";
    } else {
        echo "Connexion LDAP anonmye échouée...";
    }

}

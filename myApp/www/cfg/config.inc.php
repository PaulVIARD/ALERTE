<?php

// LDAP variables
$ldaphost = "annuaire.test.inetpsa.com";  // votre serveur LDAP
$ldapport = 389;                 // votre port de serveur LDAP

// Connexion LDAP
$ldapconn = ldap_connect($ldaphost, $ldapport)
          or die("Impossible de se connecter au serveur LDAP $ldaphost");

?>


// El�ments d'authentification LDAP
$ldaprdn  = 'uname';     // DN ou RDN LDAP
$ldappass = 'password';  // Mot de passe associ�

// Connexion au serveur LDAP
$ldapconn = ldap_connect("ldap.example.com")
    or die("Impossible de se connecter au serveur LDAP.");

if ($ldapconn) {

    // Connexion au serveur LDAP
    $ldapbind = ldap_bind($ldapconn, $ldaprdn, $ldappass);

    // V�rification de l'authentification
    if ($ldapbind) {
        echo "Connexion LDAP r�ussie...";
    } else {
        echo "Connexion LDAP �chou�e...";
    }

}


// Connexion anonyme � un serveur LDAP

// Connexion au serveur LDAP
$ldapconn = ldap_connect("ldap.example.com")
    or die("Impossible de se connecter au serveur LDAP.");

if ($ldapconn) {

    // Authentification anonyme
    $ldapbind = ldap_bind($ldapconn);

    if ($ldapbind) {
        echo "Connexion LDAP anonmye r�ussie...";
    } else {
        echo "Connexion LDAP anonmye �chou�e...";
    }

}

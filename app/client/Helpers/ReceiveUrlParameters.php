<?php

namespace Client\Helpers;

/**
 * Classe responsável por receber os parâmetros (?parametro=valor) da URL.
 */
class ReceiveUrlParameters {
    /**
     * Recebe os parâmetros (GET) da URL.
     *
     * @return void
     */
    public static function receiveUrlParameters(string $parameter = "")
    {
        // Receber a url e dividir as partes.
        $parseUrlLogin = parse_url($_SERVER['REQUEST_URI']);

        // Receber a query da url (completa em string), se houver.
        $urlQuery = $parseUrlLogin['query'] ?? "";

        // Dividindo a query (string) em um array.
        parse_str($urlQuery, $queryParams);

        $queryParams = filter_var_array($queryParams, FILTER_SANITIZE_SPECIAL_CHARS);

        if ($parameter) {
            return $queryParams[$parameter] ?? null;
        }

        return $queryParams;
    }
}

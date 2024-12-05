class Webpay::Payloads  
    def self.getNormalPayload(result)

        payload = {
            'wSTransactionType' => 'TR_NORMAL_WS',
            'state' => result['error_desc'].to_s,
            'accountingdate' => result['accountingdate'].to_s,
            'buyOrder' => result['buyorder'].to_s,
            'sharesnumber' => result['sharesnumber'].to_s,
            'cardnumber' => result['cardnumber'].to_s,
            'amount' => result['amount'].to_s,
            'commercecode' => result['commercecode'].to_s,
            'authorizationcode' => result['authorizationcode'].to_s,
            'paymenttypecode' => result['paymenttypecode'].to_s,
            'responsecode' => result['responsecode'].to_s,
            'transactiondate' => result['transactiondate'].to_s,
            'urlredirection' => result['urlredirection'].to_s,
            'vci' => result['vci'].to_s,
            'transactionDetails' => {
                'amount' => result['amount'].to_s,
                'commerceCode' => result['commercecode'].to_s,
                'buyOrder' => result['buyorder'].to_s,
            }
        }
    return payload
    end
end
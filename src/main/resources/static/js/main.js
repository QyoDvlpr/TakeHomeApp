
(function ($) {
    "use strict";

    $("#chkRegister").on('click', showHidePasswordConfirm);

    const cognito = {
        userPoolId: 'us-east-2_8N40YnTeJ',
        region: 'us-east-2',
        clientId: '7uk0f58t41te79js9fpvrjlegu'
    }

    AWS.config.region = cognito.region;

    const poolData = { 
        UserPoolId : cognito.userPoolId,
        ClientId : cognito.clientId
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').submit(function(event){
        var check = true;

        for(var i=0; i<input.length; i++) {
            
            if(validate(input[i]) == false && $(input[i]).is(':visible')){
                showValidate(input[i]);
                check=false;
            }
        }

        if(check) {
            event.preventDefault();
            loginCognito();
        }

        return check;
    });

    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    function showHidePasswordConfirm() {
        if($("#passConfirm").is(':visible')) {
            $("#passConfirm").attr('hidden', true);
        }
        else {
            $("#passConfirm").removeAttr('hidden');
        }
    }

    function cleanForm() {
        for(var i=0; i<input.length; i++) {
            $(input[i]).val("");
        }
        showHidePasswordConfirm();
        $("#chkRegister").prop("checked", false);
    }
    
    function loginCognito() {

        if($("#chkRegister").is(":checked")) {
            var attributeList = [];
 
            var dataEmail = {
                Name: 'email',
                Value: $(input[0]).val().trim(),
            };
            
            var dataPhoneNumber = {
                Name: 'phone_number',
                Value: '+15555555555',
            };
            var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
            var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(
                dataPhoneNumber
            );
            
            attributeList.push(attributeEmail);
            attributeList.push(attributePhoneNumber);

            userPool.signUp($(input[0]).val().trim(), $(input[1]).val().trim(), attributeList, null, function(
                err,
                result
            ) {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }
                var cognitoUser = result.user;
                console.log('user name is ' + cognitoUser.getUsername());
                cleanForm();
            });
        }
        else {
            var authenticationData = {
                Username : $(input[0]).val().trim(),
                Password : $(input[1]).val().trim()
            };
    
            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
            var userData = {
                Username : $(input[0]).val().trim(),
                Pool : userPool
            };
    
            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    var accessToken = result.getAccessToken().getJwtToken();
                    var idToken = result.idToken.jwtToken;
                    var postData = {
                        username: authenticationData.Username,
                        token: idToken
                    };
    
                    console.log(idToken);
                    window.location = '/hello?username=' + authenticationData.Username + '&token=' + idToken;
                },
    
                onFailure: function(err) {
                    console.log(err.message || JSON.stringify(err));
                },
    
            });
        }
        
    }
    

})(jQuery);
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

window.onload = function () {
setTimeout(() => {
    function getCheckout(cart_id){
        console.log('here', cart_id);
        fetch("/api/storefront/checkouts/"+ cart_id, {
        "method": "GET",
        "mode":"no-cors",
        "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Auth-Token": "ht5prka3ytn4v4gqev5natkrzy9o86y"
        }
        })
        .then(res => res.json())
        .then(d => {
        console.log('success', d);

        jQuery(".taxClick").addClass('jii');
        var taxValStart = d['consignments'][0]['address']['postalCode'];
        var subTotal = d['subtotal'];

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
    
        var raw = JSON.stringify({
        'pincode': taxValStart
        });
    
        const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        body: raw,
        };
    
        fetch('http://localhost/api/amount.php', requestOptions)
        .then(res => res.json()).then(da => {
            var finalTotal = Math.round((subTotal + parseFloat(da.price)) * 100)/100;
            console.log('success', da.price);
            jQuery("[data-test=cart-taxes] div .cart-priceItem-value span").html("$ "+da.price);
            jQuery("[data-test=cart-total] div .cart-priceItem-value span").html("$ "+finalTotal);
        })
        .catch(error => console.log('error', error));

        console.log('changed');
        })
        .catch(err => {
        console.error(err);
        });
    }

    console.log('No dtsssa');
    jQuery.noConflict();
    jQuery(document).ready(function(){
        
        fetch('/api/storefront/carts')
        .then(res => res.json())
        .then(res => {
            cart_id = res[0]['id'];
            getCheckout(cart_id);
        });

        jQuery(document).on('click','.clickTax',function() {
            setTimeout(() => {
            fetch('/api/storefront/carts')
            .then(res => res.json())
            .then(res => {
                cart_id = res[0]['id'];
                getCheckout(cart_id);
            });
            
            }, 1000);
        });
    });
}, 1000);
}

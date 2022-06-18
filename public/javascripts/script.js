

function addToCart(proId){
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $('#cart-count').html(count)
            }
            
        }
    })
}

function changeQuantity(cartId,proId,userId,count){
    let quantity=parseInt(document.getElementById(proId).innerHTML)
    count=parseInt(count)
    console.log(userId)
    $.ajax({
        url:'/change-product-quantity',
        data:{
            user:userId,
            cart:cartId,
            product:proId,
            count:count,
            quantity:quantity
        },
        method:'post',
        success:(response)=>{
            if(response.removeProduct){
                alert("Product removed from cart")
                location.reload()
            }else{     
                console.log(response)           
                document.getElementById(proId).innerHTML=quantity+count
                document.getElementById('total').innerHTML=response.total
            }
        }
    })
}


function removeProduct(proId,cartId,Name){
    var check=confirm("Do you want to remove "+Name+" from cart?")
    if(check){
        $.ajax({
            url:'/remove-product',
            data:{
                product:proId,
                cart:cartId
            },
            method:'post',
            success:(response)=>{
                $(proId).remove()
                let msg=Name+" removed"
                $('#delete-msg').html(msg)
                location.reload()
            }
        })
    }
}
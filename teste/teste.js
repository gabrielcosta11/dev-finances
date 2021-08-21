var a = '-200'

function currencyFormat(amount) {
    let currency = Number(amount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    return currency
}

var b = currencyFormat(a)

if(a > 0) {
    console.log('positivo')
    console.log(b)
}
else if(a < 0) {
    console.log('negativo')
    console.log(b)
}

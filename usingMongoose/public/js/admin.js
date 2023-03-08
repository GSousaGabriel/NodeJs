const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector("[name=productId]").value
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value
    const article = btn.parentNode.closest("article")

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            "csrf-token": csrf
        }
    })
    .then(success => {
        console.log(success)
        article.parentNode.removeChild(article)
    })
    .catch(error => {
        console.log(error)
    })
}
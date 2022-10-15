const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name="productId"]').value;
  const csrf = btn.parentNode.querySelector('[name="_csrf"]').value;
  console.log(btn);
  const p = btn.closest("article");
  console.log(p);

  fetch("/admin/product/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      p.parentNode.removeChild(p);
    })
    .catch((err) => {
      console.log(err);
    });
};

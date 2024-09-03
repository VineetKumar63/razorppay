import TshirtImg from "./tshirt.svg";

function Product() {
  const amount = 500 * 100;
  const receiptId = "qwsaq1";

  const paymentHandler = async (e) => {
    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
      }),
    });
    const order = await response.json();
    var options = {
      key: "rzp_test_zmEiBVwajjPkkU", // Enter the Key ID generated from the Dashboard
      amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response
        };
        const validateRes = await fetch(
          "http://localhost:5000/order/validate",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json()
        alert(jsonRes.msg)
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    let rzp1 = new window.Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on(
      "payment.failed",
      function (response) {
        alert(response.error);
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      },
    );
  };

  return (
    <div className="product">
      {/* <script src="https://checkout.razorpay.com/v1/checkout.js"/> */}
      <h2>Tshirt</h2>
      <p>Solid blue cotton Tshirt</p>
      <img src={TshirtImg} alt="tshirt" />
      <br />
      <button onClick={paymentHandler}>Pay</button>
    </div>
  );
}

export default Product;

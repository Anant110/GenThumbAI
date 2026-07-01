import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../configs/api";


interface Product{
  discription:string
  price:number
}

const Success = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [product,setProduct]=useState<Product | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("session_id")
    setSessionId(id)
    // console.log(id)
  },[])


  useEffect(() => {
    if (!sessionId) return;

    const confirmOrder = async () => {
      try {
        const response = await api.post("/order/confirm", { sessionId });
        // console.log(response)
        const item = await response.data.line_items.data[0];

        setProduct({
          discription:item.description,
          price:item.price
        })

        // console.log(item)
      } catch (error) {
        console.error(error);
      }
    };
    confirmOrder();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        <CheckCircle
          size={80}
          className="mx-auto text-green-500 mb-5"
        />

        <h1 className="text-3xl font-bold text-gray-800">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mt-4 leading-7">
          Thank you for your purchase.
            <br />
          {product?.discription}
          <br />
          Your subscription has been activated successfully.
        </p>

        <button
          onClick={()=>{
            window.location.href="/"
          }}
          className="inline-block mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 
          rounded-lg transition">
          Go to Home
        </button>
        
      </div>
    </div>
  );
};

export default Success;
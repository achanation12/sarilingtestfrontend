"use client";
import { useState, useEffect } from "react";

export default function Home() {

  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  }
  
  const [items, setItems] = useState<any[]>([]);
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const formatRupiah = (num : number) => {
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  useEffect(() => {
    // Mengambil data dari localStorage
    if (typeof window !== "undefined") {
      const storedItems = JSON.parse(localStorage.getItem("cart") || "[]") || [];
      setItems(storedItems);
    }
    //Dapatkan data produk dari API
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data); // Sesuaikan dengan struktur API
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
      });
  }, []);
  // Filter produk berdasarkan input pencarian
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Fungsi untuk menambah item ke localStorage
  const addItem = (newItem: { id: number; name: string; price: number, image: string }) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  
    // Cek apakah item sudah ada di dalam cart
    const existingIndex = existingCart.findIndex((item: any) => item.id === newItem.id);
  
    if (existingIndex !== -1) {
      // Jika item sudah ada, update qty
      existingCart[existingIndex].qty += 1;
    } else {
      // Jika item belum ada, tambahkan dengan qty 1
      existingCart.push({ ...newItem, qty: 1 });
    }
  
    // Simpan perubahan ke state & localStorage
    setItems(existingCart);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    //Notifikasi tambah item
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50";
    toast.innerText = `${newItem.name} ditambahkan ke keranjang`;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }
    , 3000);
  };
  // Fungsi untuk menghapus item dari localStorage
  const removeItem = (itemId: number) => {
    // Ambil cart dari localStorage
    let updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
  
    // Filter item yang tidak memiliki id yang ingin dihapus
    updatedCart = updatedCart.filter((item: any) => item.id !== itemId);
  
    // Simpan perubahan ke state & localStorage
    setItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  // Hitung total harga
  const calculateTotalPrice = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  
    // Hitung total harga dengan reduce
    const totalPrice = cart.reduce((total: number, item: any) => {
      return total + item.price * item.qty; // Harga * qty per item
    }, 0); // Mulai dari 0
  
    return totalPrice;
  };
  // Hitung total item
  const calculateTotalItem = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  
    // Hitung total item dengan reduce
    return cart.length;
  };
  // Fungsi untuk mengirim data ke API
  const sendCartDataToApi = async () => {
    if (typeof window !== "undefined") {
      // Ambil cart dari localStorage
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Pastikan cart ada sebelum mengirim
      if (cart.length > 0) {
        fetch("http://127.0.0.1:8000/api/checkout", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              items: cart,
              total_price: calculateTotalPrice(),
          }),
        })
          .then((res) => {
              if (!res.ok) {
                  // Tangani status error dengan lebih jelas
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }
              return res.json();
          })
          .then((data) => {
            
              //Notifikasi tambah item
              const toast = document.createElement("div");
              toast.className = "fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50";
              toast.innerText = `${data.message}, Total ${formatRupiah(data.total_price)}`;
              document.body.appendChild(toast);
              setTimeout(() => {
                document.body.removeChild(toast);
              }
              , 3000);
              console.log(data); // Tangani data respons di sini
          })
          .catch((error) => {
              console.log("Fetch error:", error);
          });      
      }
    }
  }
  return (
    <div>
      {/* <!-- ========== HEADER ========== --> */}
        <header className="flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full py-7">
          <nav className="relative max-w-7xl w-full flex flex-wrap lg:grid lg:grid-cols-12 basis-full items-center px-4 md:px-6 lg:px-8 mx-auto">
            <div className="lg:col-span-3 flex items-center">
              <a className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80" href="" aria-label="Preline">
                Galih J. Felis
              </a>
              <div className="ms-1 sm:ms-2">
              </div>
            </div>

            {/* <!-- Button Group --> */}
            <div className="flex items-center gap-x-1 lg:gap-x-2 ms-auto py-1 lg:ps-6 lg:order-3 lg:col-span-3">
              <button onClick={() => setIsOpenCart(true)} type="button" className=" hover:cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium text-nowrap rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <span className="text-[8pt] bg-red-500 rounded-full w-[20px] h-[20px] items-center justify-center flex text-white">{calculateTotalItem()}</span>
              </button>

              {/* <div className="lg:hidden">
                <button type="button" className="hs-collapse-toggle size-9.5 flex justify-center items-center text-sm font-semibold rounded-xl border border-gray-200 text-black hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" id="hs-navbar-hcail-collapse" aria-expanded="false" aria-controls="hs-navbar-hcail" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-hcail">
                  <svg className="hs-collapse-open:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                  <svg className="hs-collapse-open:block hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div> */}
            </div>
            {/* <!-- End Button Group --> */}

            {/* <!-- Collapse --> */}
            <div id="hs-navbar-hcail" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block lg:w-auto lg:basis-auto lg:order-2 lg:col-span-6" aria-labelledby="hs-navbar-hcail-collapse">
            </div>
            {/* <!-- End Collapse --> */}
          </nav>
        </header>
        {/* <!-- ========== END HEADER ========== --> */}
        {/* <!-- ========== CART ========== --> */}
        <div className={`relative z-50 ${!isOpenCart ? "hidden" : "block"}`} aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button onClick={() => setIsOpenCart(false)} type="button" className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 hover:cursor-pointer">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Close panel</span>
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {items.map((item) => (
                              <li className="flex py-6" key={item.id}>
                                <div className="size-24 shrink-0 overflow-hidden rounded-xs border border-gray-200">
                                  <img src={item.image} alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." className="size-full object-cover"/>
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href="#">{item.name}</a>
                                      </h3>
                                      {/* <p className="ml-4"></p> */}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{formatRupiah(item.price)}</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty {item.qty}</p>

                                    <div className="flex">
                                      <button onClick={() => removeItem(item.id)} type="button" className="font-medium text-indigo-600 hover:text-indigo-500 hover:cursor-pointer">Remove</button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{formatRupiah(calculateTotalPrice())}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div className="mt-6">
                        <button onClick={sendCartDataToApi} className="hover:cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700">Checkout</button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- ========== END CART ========== --> */}


        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md w-full mb-4"
          />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Product</h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <span onClick={() => addItem({id: product.id, name: product.name, price: product.price, image: product.image})} className="relative bg-cover group rounded-3xl bg-center overflow-hidden mx-auto sm:mr-0 xl:mx-auto cursor-pointer">
                    <img 
                        className="w-full h-full object-cover rounded-md"
                        src={product.image}
                        alt={product.name}/>
                    <div
                        className="absolute z-10 bottom-3 left-0 mx-3 p-3 bg-white w-[calc(100%-24px)] rounded-xl shadow-sm shadow-transparent transition-all duration-500 group-hover:shadow-indigo-200 group-hover:bg-indigo-50">
                        <div className="flex items-center justify-between mb-2">
                            <h6 className="font-semibold text-base leading-7 text-black ">{product.name}</h6>
                            {/* <h6 className="font-semibold text-base leading-7 text-indigo-600 text-right"></h6> */}
                        </div>
                        <p className="text-xs leading-5 text-gray-500">{formatRupiah(product.price)}</p>
                    </div>
                </span>
              </div>
            ))}
            </div>
          </div>
        </div>
        <footer className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">2025 Galih Junaedi Felis</p>
          </div>
        </footer>
    </div>
  );
}

import {useGetTopProductQuery} from "../redux/api/productsApiSlice.js"
import Loader from "./Loader.jsx"
import SmallProduct from "../pages/Products/SmallProduct.jsx"
import ProductCarousel from "../pages/Products/ProductCarousel.jsx"

const Header = () => {
  const {data, isLoading, error} = useGetTopProductQuery()
  
  if (isLoading) {
    return <Loader />
  }

  if (error) {
    console.log(error);
    return <h1>ERROR</h1>
  }

  return (
    <>
    <div className="flex justify-around">
      <div className="xl:block lg:hidden md:hidden:sm:hidden">
        <div className="grid grid-cols-2">
          {data.map((product) => (
            <div key={product._id}>
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>
      <ProductCarousel />
    </div>
    </>
  )
}

export default Header
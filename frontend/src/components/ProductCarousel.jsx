import { Link } from "react-router-dom"
import { Carousel, Image } from "react-bootstrap"
import Message from "./Message"
import { useGetTopProductsQuery } from "../slices/productsApiSlice"

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery() // we can pass "3" in here to get exactly top 3 products, but we already config it hard-coded in the back-end, we can make it configurable if we want

  // the reason why isLoading then return null but not <Loader /> is because this Carousel in used in the HomeScreen, but in the HomeScreen we already have 1 <Loader />, if this Carousel return a <Loader /> too then it would be a mess
  return isLoading ? null : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-primary mb-4">
      {products.map(product => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              {/* we have the class "carousel-caption" in assets/styles/index.css */}
              <h2 className="text-white text-right">
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel

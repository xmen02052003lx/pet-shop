import { Row, Col } from "react-bootstrap"
import Product from "../components/Product"
import { useParams, Link } from "react-router-dom"
import { useGetProductsQuery } from "../slices/productsApiSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import Paginate from "../components/Paginate"
import ProductCarousel from "../components/ProductCarousel"
const HomeScreen = () => {
  const { pageNumber, keyword } = useParams()

  const { data, isLoading, error } = useGetProductsQuery({
    keyword, // put the keyword first (before pageNumber) because that the way it is set up in productsApiSlice
    pageNumber
  }) // if we dont use toolkit, we have to define "isLoading" and "error" ourself, which is a pain

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        // if there is a keyword (so we are looking at the search result), show the "Go Back" button
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Sản phẩm mới nhất</h1>
          <Row>
            {data.products.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  )
}
export default HomeScreen

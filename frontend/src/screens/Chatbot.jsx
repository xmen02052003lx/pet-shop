import React, { useState } from "react"
import axios from "axios"
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap"

const Chatbot = () => {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  // const [previousResponse, setPreviousResponse] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "system",
              content:
                "You are Customer service representative of a pet shop that sells products for pet (cats and dogs)"
            },
            {
              role: "user",
              content: prompt
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer sk-proj-7ip9BWfTQZcoXifnRdjZT3BlbkFJgsdRi04PfyDVZddDTxIH` // Replace YOUR_API_KEY with your actual API key
          }
        }
      )

      // setPreviousResponse(response) // Store the previous response
      setResponse(res.data.choices[0].message.content)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <h1 className="text-center mb-4">ChatBot Hỗ Trợ Khách Hàng</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPrompt">
              <Form.Label>Enter your prompt:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Enter your prompt"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          {/* {previousResponse && (
            <div className="mt-4">
              <h2>Previous Response:</h2>
              <p>{previousResponse}</p>
            </div>
          )} */}
          {response && (
            <div className="mt-4">
              <h2>Response:</h2>
              <p>{response}</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Chatbot

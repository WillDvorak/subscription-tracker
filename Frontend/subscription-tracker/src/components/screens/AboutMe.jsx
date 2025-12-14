import { Container, Row, Col, Card } from "react-bootstrap";

export default function AboutMe() {
    return (
    <Container>
      {/* Header */}
      <Row>
        <Col>
          <h1>About Me</h1>
        </Col>
      </Row>

      {/* Intro section */}
      <Row>
        <Col md={4}>
          {/* Profile image */}
          <Card>
            <Card.Body>
              {/* Replace with your own image URL */}
              <img
                style={{ width: "100%", height: "auto" }}
                src="https://upload.wikimedia.org/wikipedia/en/archive/b/b1/20210811082420%21Portrait_placeholder.png"
                alt="placeholder profile image"
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <h2>Hello, I'm Will Dvorak</h2>
              <p>
                I'm a computer science student who enjoys
                building web apps, learning new technologies, and working on
                projects that solve real problems.
              </p>
              <p>
                In my free time, I like listening to music, programming, and playing video games. I'm
                especially interested in software development and web development, as the idea of creating 
                theoretically any software you can imagine is my favorite part of computer science.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Skills / Technologies */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h3>Skills & Technologies</h3>
              <ul>
                <li>JavaScript</li>
                <li>React & React-Bootstrap</li>
                <li>HTML & CSS</li>
                <li>And more! ADD MORE !!!!</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Projects */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h3>Projects</h3>
              <ul>
                <li>
                  <strong>Subscription Tracker:</strong> A web app for tracking
                  recurring subscriptions, sorting by priority, and organizing
                  renewal dates.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h3>Contact</h3>
              <p>Email: wjdvorak99@gmail.com</p>
              <p>GitHub: github.com/WillDvorak</p>
              <p>LinkedIn: linkedin.com/</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
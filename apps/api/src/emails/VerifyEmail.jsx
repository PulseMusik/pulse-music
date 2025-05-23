import {
  Body,
  Button,
  Html,
  Text,
  Tailwind,
  Container,
  Font,
  Section,
  Img,
} from "@react-email/components";
import * as React from "react";

export default function Email({ username }) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
              blue: "#4184f3"
            },
            fontFamily: {
              sans: ['"Cal Sans"', "Arial", "sans-serif"],
            },
          },
        },
      }}
    >
      <Html>
        <Font
          fontFamily="Cal Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Cal+Sans:wght@400;700&display=swap",
            format: "woff2",
          }}
        />
        <Body className="bg-white flex items-center justify-center min-h-screen w-full font-sans">
          <Container
            className="rounded-lg p-4 px-8"
            style={{ ...border, ...boxWidth }}
          >
           <Section className="w-full flex justify-center mt-2">
              <Img src="https://i.ibb.co/YFxrgxDy/blue-filled.png" alt="Pulse Logo" height={50} />
            </Section>

            <Text className="text-2xl font-bold text-center mb-4">
              Verify your email
            </Text>
            <Text className="mb-2">Hello {username},</Text>
            <Text className="mb-4">
              Thank you for signing up for Pulse. Please verify your email by
              clicking the button below.
            </Text>

            <Section className="w-full flex justify-center">
              <Button
                href="https://youtube.com"
                className="bg-blue text-white font-medium py-2 px-4 rounded mb-4 text-xs"
              >
                Verify Email
              </Button>
            </Section>

            <div style={background} className="w-full h-[1px] my-4"></div>

            <Text className="text-sm text-gray-600">
              If you did not request this email, something might be using your
              account. Please secure it.
            </Text>

            <div style={background} className="w-full h-[1px] my-4"></div>

            <Text className="text-xs text-gray-600">
              PULSE HEADQUARTERS
            </Text>
            
            <Text className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} PulseMusik. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

const border = {
  border: "2px solid hsla(220,14%,94%,1)",
};

const background = {
  backgroundColor: "hsla(220,14%,94%,1)",
};

const boxWidth = {
  width: "405px",
};
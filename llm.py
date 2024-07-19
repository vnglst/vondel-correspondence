import os

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


class LLM:
    def __init__(self):
        OpenAI.api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI()

    def generate(
        self, messages, model="gpt-4o-2024-05-13", temperature=0, max_tokens=4096
    ):
        print(f"Generating response with model {model}")

        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content

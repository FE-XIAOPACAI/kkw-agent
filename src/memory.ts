export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export class Memory {
  private messages: Message[] = [];

  add(message: Message): void {
    this.messages.push(message);
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  clear(): void {
    this.messages = [];
  }
}

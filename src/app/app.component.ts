import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpenAI } from 'openai';
import { environment } from '../../environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  promptText = signal('');
  output = signal<string | null>('');

  chats = signal<any>([]);

  isLoading = false;

  async search() {
      const openai = new OpenAI({
        apiKey: environment.openAiKey,
        dangerouslyAllowBrowser: true
      });

      // Define o estado de carregamento como true antes da requisição
      this.isLoading = true;

      try {
        const response = await openai.chat.completions.create({
          messages: [
            {
              "role": "user",
              "content": `${this.promptText()}`,
            },
          ],
          model: 'gpt-3.5-turbo',
        });

        this.output.set(response.choices[0].message.content);
        const chat = {
          question: this.promptText(),
          answer: this.output
        };
        this.chats.set([chat, ...this.chats()]);
        console.log(this.chats);
        console.log(response.choices[0].message.content);
      } catch (error) {
        console.error('Error occurred while fetching API response:', error);
      } finally {
        this.isLoading = false;
      }
  }

}

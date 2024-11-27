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

  isLoading = signal(false);

  async search() {
    const openai = new OpenAI({
      apiKey: environment.openAiKey,
      dangerouslyAllowBrowser: true
    });

    this.isLoading.set(true);

    try {
      const response = await openai.chat.completions.create({
        messages: [
          {
            "role": "user",
            "content": `${this.promptText()}`,
          },
        ],
        model: 'gpt-4',
      });

      this.output.set(response.choices[0].message.content);
    } catch (error) {
      console.error('Error occurred while fetching API response:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  getOutputText(): string | null {
    return this.output();
  }

  getWhatsappShareLink(): string {
    const text = this.getOutputText();

    return text
      ? `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
      : '';
  }

}

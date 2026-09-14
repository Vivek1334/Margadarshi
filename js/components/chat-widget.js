// WanderAI Conversational Assistant Widget (Google Gemini Powered)

import { geminiService } from "../services/gemini-service.js";
import { DESTINATIONS } from "../destinations-data.js";

export class ChatWidget {
  constructor(containerId = "chat-widget-container") {
    this.container = document.getElementById(containerId);
    this.isOpen = false;
    this.currentDestContext = null;
    this.isGenerating = false;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();

    window.addEventListener("voyage:open-chat-with-query", (e) => {
      this.openChat();
      if (e.detail?.query) {
        this.handleUserSend(e.detail.query);
      }
    });
  }

  setDestinationContext(dest) {
    this.currentDestContext = dest;
    const badge = document.getElementById("chat-dest-badge");
    if (badge) {
      if (dest) {
        badge.innerHTML = `Chatting about: <span class="text-emerald-400 font-bold">${dest.name}</span>`;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    }
  }

  render() {
    const hasKey = geminiService.hasApiKey();

    this.container.innerHTML = `
      <!-- Floating Chat Toggle Trigger Button -->
      <button 
        id="btn-open-chat" 
        class="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all duration-200 focus:outline-none"
        title="Chat with WanderAI Travel Assistant"
      >
        <i data-lucide="sparkles" class="w-5 h-5 text-slate-950"></i>
        <span>Ask WanderAI</span>
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>
      </button>

      <!-- Chat Modal Window / Drawer -->
      <div 
        id="chat-drawer" 
        class="fixed bottom-6 right-4 sm:right-6 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none"
      >
        <!-- Chat Header -->
        <div class="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-white text-sm">WanderAI Concierge</h3>
                <span id="gemini-status-indicator" class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${hasKey ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}">
                  ${hasKey ? 'Gemini 2.5 Live' : 'AI Assistant'}
                </span>
              </div>
              <p class="text-[11px] text-slate-400" id="chat-dest-badge">
                Your 24/7 Global Travel Expert
              </p>
            </div>
          </div>

          <!-- Controls: Clear & Close -->
          <div class="flex items-center gap-1">
            <button id="btn-clear-chat" class="p-1.5 text-slate-400 hover:text-white transition-colors" title="Clear conversation">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
            </button>
            <button id="btn-close-chat" class="p-1.5 text-slate-400 hover:text-white transition-colors" title="Close chat">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- Chat Messages Container -->
        <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          <!-- Initial Welcome Message -->
          <div class="flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <i data-lucide="bot" class="w-4 h-4"></i>
            </div>
            <div class="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-sm p-3.5 text-slate-200 leading-relaxed max-w-[85%]">
              Hello adventurer! I'm <b>WanderAI</b>. Ask me anything about destinations, how many days to spend, what to see, what to pack, or authentic culinary secrets!
            </div>
          </div>
        </div>

        <!-- Quick Prompt Suggestion Chips -->
        <div class="px-3 py-2 bg-slate-950/60 border-t border-slate-800/70 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-[11px]">
          <button class="chat-chip px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors">
            How long to spend here?
          </button>
          <button class="chat-chip px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors">
            When is best time to go?
          </button>
          <button class="chat-chip px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors">
            Top local foodie dishes?
          </button>
          <button class="chat-chip px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors">
            Essential packing list?
          </button>
        </div>

        <!-- Chat Input Form -->
        <form id="chat-input-form" class="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
          <input 
            type="text" 
            id="chat-user-input" 
            placeholder="Ask WanderAI a question..." 
            autocomplete="off"
            class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          <button 
            type="submit" 
            id="chat-submit-btn" 
            class="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <i data-lucide="send" class="w-4 h-4"></i>
          </button>
        </form>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents() {
    const openBtn = document.getElementById("btn-open-chat");
    const closeBtn = document.getElementById("btn-close-chat");
    const clearBtn = document.getElementById("btn-clear-chat");
    const form = document.getElementById("chat-input-form");

    if (openBtn) openBtn.addEventListener("click", () => this.toggleChat());
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeChat());
    if (clearBtn) clearBtn.addEventListener("click", () => this.clearChat());

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("chat-user-input");
        const val = input.value.trim();
        if (val) {
          input.value = "";
          this.handleUserSend(val);
        }
      });
    }

    // Quick chip buttons
    this.container.querySelectorAll(".chat-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const text = chip.textContent.trim();
        this.handleUserSend(text);
      });
    });
  }

  toggleChat() {
    if (this.isOpen) this.closeChat();
    else this.openChat();
  }

  openChat() {
    this.isOpen = true;
    const drawer = document.getElementById("chat-drawer");
    const openBtn = document.getElementById("btn-open-chat");
    if (drawer) {
      drawer.classList.remove("translate-y-12", "opacity-0", "pointer-events-none");
    }
    if (openBtn) openBtn.classList.add("scale-0");

    const input = document.getElementById("chat-user-input");
    if (input) setTimeout(() => input.focus(), 250);
  }

  closeChat() {
    this.isOpen = false;
    const drawer = document.getElementById("chat-drawer");
    const openBtn = document.getElementById("btn-open-chat");
    if (drawer) {
      drawer.classList.add("translate-y-12", "opacity-0", "pointer-events-none");
    }
    if (openBtn) openBtn.classList.remove("scale-0");
  }

  clearChat() {
    geminiService.clearChatHistory();
    const msgs = document.getElementById("chat-messages");
    if (msgs) {
      msgs.innerHTML = `
        <div class="flex items-start gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <i data-lucide="bot" class="w-4 h-4"></i>
          </div>
          <div class="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-sm p-3.5 text-slate-200 leading-relaxed max-w-[85%]">
            Conversation reset. What can I help you discover next?
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  async handleUserSend(messageText) {
    if (this.isGenerating) return;
    this.isGenerating = true;

    // Append user message
    this.appendMessage("user", messageText);

    // Append typing indicator
    const typingId = this.appendTypingIndicator();

    try {
      const response = await geminiService.sendMessage(messageText, this.currentDestContext);
      this.removeTypingIndicator(typingId);
      this.appendMessage("model", response.text);
    } catch (err) {
      this.removeTypingIndicator(typingId);
      this.appendMessage("model", "I encountered a slight turbulence connecting to the travel servers. Please try again or check your Gemini API key in Settings.");
    } finally {
      this.isGenerating = false;
    }
  }

  appendMessage(role, text) {
    const msgs = document.getElementById("chat-messages");
    if (!msgs) return;

    const div = document.createElement("div");
    div.className = "flex items-start gap-2.5";

    if (role === "user") {
      div.className += " justify-end";
      div.innerHTML = `
        <div class="bg-emerald-500 text-slate-950 font-medium rounded-2xl rounded-tr-sm p-3 text-xs sm:text-sm leading-relaxed max-w-[85%] shadow-md">
          ${this.escapeHtml(text)}
        </div>
      `;
    } else {
      // Format markdown-like bold and bullet points
      const formatted = this.formatMarkdown(text);
      div.innerHTML = `
        <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <i data-lucide="bot" class="w-4 h-4"></i>
        </div>
        <div class="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-sm p-3.5 text-slate-200 leading-relaxed max-w-[85%]">
          ${formatted}
        </div>
      `;
    }

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }

  appendTypingIndicator() {
    const msgs = document.getElementById("chat-messages");
    if (!msgs) return null;

    const id = `typing-${Date.now()}`;
    const div = document.createElement("div");
    div.id = id;
    div.className = "flex items-center gap-2.5";
    div.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <i data-lucide="bot" class="w-4 h-4"></i>
      </div>
      <div class="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
      </div>
    `;

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
    return id;
  }

  removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  formatMarkdown(text) {
    if (!text) return "";
    let html = this.escapeHtml(text);
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Bullet points
    html = html.replace(/^• (.*$)/gim, "<li class='ml-3'>$1</li>");
    html = html.replace(/^- (.*$)/gim, "<li class='ml-3'>$1</li>");
    // Newlines to br
    html = html.replace(/\n/g, "<br/>");
    return html;
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

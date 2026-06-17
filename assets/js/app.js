
(() => {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

  const menuBtn = $('[data-menu-toggle]');
  const mobileMenu = $('[data-mobile-menu]');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }

  const modalBackdrop = $('#global-modal');
  const modalTitle = $('#modal-title');
  const modalText = $('#modal-text');
  const modalIcon = $('#modal-icon');
  const openModal = (title, text, icon='✦') => {
    if (!modalBackdrop) return;
    modalTitle.textContent = title;
    modalText.textContent = text;
    modalIcon.textContent = icon;
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden','false');
  };
  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden','true');
  };
  $$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  if (modalBackdrop) modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  $$('[data-libras]').forEach(btn => btn.addEventListener('click', () => {
    openModal('Tradutor de Libras', 'O recurso com avatar 3D está previsto para uma próxima etapa. Nesta versão, o botão demonstra apenas a posição e a experiência de acesso.', '🤟');
  }));

  const toast = $('#toast');
  let toastTimer;
  window.showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  $$('[data-demo]').forEach(el => el.addEventListener('click', (e) => {
    if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href') !== '#') return;
    e.preventDefault();
    showToast('Ação demonstrativa: nenhum dado real foi processado.');
  }));

  $$('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const type = form.dataset.demoForm;
      if (type === 'escuta') {
        const protocol = `IM-2026-${Math.floor(10000 + Math.random()*89999)}`;
        const codeEl = $('#generated-protocol');
        if (codeEl) codeEl.textContent = protocol;
        const priorityVisible = $('[data-priority-banner]') && !$('[data-priority-banner]').hidden;
        openModal(priorityVisible ? 'Relato prioritário' : 'Mensagem simulada com sucesso', priorityVisible ? `Aguarde... Protocolo: ${protocol}.` : `Nenhum conteúdo foi enviado. Protocolo visual gerado: ${protocol}.`, priorityVisible ? '⚠' : '✓');
      } else if (type === 'acompanhar') {
        const result = $('#protocol-result');
        if (result) result.hidden = false;
        showToast('Protocolo demonstrativo localizado.');
      } else if (type === 'login') {
        const target = form.dataset.target;
        showToast('Acesso demonstrativo liberado.');
        setTimeout(() => { if(target) window.location.href = target; }, 450);
      } else if (type === 'contact') {
        openModal('Mensagem não enviada', 'Este formulário faz parte do protótipo visual e ainda não está conectado a um canal de atendimento.', '✉');
      } else {
        showToast('Formulário demonstrativo. Nenhuma informação foi enviada.');
      }
    });
  });

  $$('[data-accordion]').forEach(acc => {
    const btn = $('.accordion-btn', acc);
    if (btn) btn.addEventListener('click', () => acc.classList.toggle('open'));
  });

  $$('[data-filter]').forEach(filter => filter.addEventListener('change', () => {
    showToast('Filtro aplicado apenas para demonstração visual.');
  }));

  $$('[data-download-demo]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    openModal('Arquivo demonstrativo', 'O botão está pronto para receber um PDF ou Word real quando o conteúdo for validado pela equipe responsável.', '⇩');
  }));

  // Search visual for library cards
  const librarySearch = $('#library-search');
  if (librarySearch) {
    librarySearch.addEventListener('input', () => {
      const term = librarySearch.value.toLowerCase().trim();
      $$('[data-media-title]').forEach(card => {
        card.style.display = card.dataset.mediaTitle.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  }

  // Tabs in access page
  $$('[data-tab-target]').forEach(tab => tab.addEventListener('click', () => {
    $$('[data-tab-target]').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tabTarget;
    $$('[data-tab-panel]').forEach(panel => panel.hidden = panel.dataset.tabPanel !== target);
  }));


  // Structured safe-area choices
  $$('[data-choice-group]').forEach(group => {
    const valueField = group.parentElement.querySelector('[data-choice-value]') || group.nextElementSibling;
    $$('[data-choice]', group).forEach(option => option.addEventListener('click', () => {
      $$('[data-choice]', group).forEach(item => item.classList.remove('active'));
      option.classList.add('active');
      if (valueField && valueField.matches('[data-choice-value]')) valueField.value = option.dataset.choice;
      if (option.dataset.choice === 'anonymous' || option.dataset.choice === 'identified') {
        const identityFields = $('[data-identity-fields]');
        const modePreview = $('[data-mode-preview]');
        if (identityFields) identityFields.hidden = option.dataset.choice !== 'identified';
        if (modePreview) modePreview.textContent = option.dataset.choice === 'identified' ? 'Identificada' : 'Anônima';
      }
    }));
  });

  $$('[data-multi-choice]').forEach(btn => btn.addEventListener('click', () => btn.classList.toggle('active')));

  const messageInput = $('[data-message-input]');
  const charCount = $('[data-char-count]');
  if (messageInput && charCount) messageInput.addEventListener('input', () => { charCount.textContent = messageInput.value.length; });

  const updateRiskState = () => {
    const values = $$('[data-risk-field]').map(field => field.value);
    const priority = values.includes('yes') || values.includes('unsafe');
    const banner = $('[data-priority-banner]');
    const submitLabel = $('[data-submit-label]');
    if (banner) banner.hidden = !priority;
    if (submitLabel) submitLabel.textContent = priority ? 'Enviar para canal prioritário' : 'Enviar mensagem segura';
  };
  $$('[data-risk-field]').forEach(field => field.addEventListener('change', updateRiskState));
  updateRiskState();

  // Coordinator inbox demo interactions
  const messageCards = $$('[data-message-card]');
  const messageDetails = $$('[data-message-detail]');
  const openMessage = (card) => {
    messageCards.forEach(item => item.classList.toggle('selected', item === card));
    messageDetails.forEach(detail => {
      const active = detail.id === card.dataset.messageTarget;
      detail.hidden = !active;
      detail.classList.toggle('active', active);
    });
  };
  messageCards.forEach(card => card.addEventListener('click', () => openMessage(card)));

  $$('[data-inbox-filter]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-inbox-filter]').forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.inboxFilter;
    messageCards.forEach(card => { card.hidden = filter !== 'all' && !card.dataset.kind.includes(filter); });
    const first = messageCards.find(card => !card.hidden);
    if (first) openMessage(first);
  }));

  const messageSearch = $('[data-message-search]');
  if (messageSearch) messageSearch.addEventListener('input', () => {
    const term = messageSearch.value.toLowerCase().trim();
    messageCards.forEach(card => { card.hidden = term && !card.dataset.search.includes(term); });
    const first = messageCards.find(card => !card.hidden);
    if (first) openMessage(first);
  });

})();

(() => {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

  // Daily emotional check-in (stored only in this browser for prototype continuity)
  const moodButtons = $$('[data-mood]');
  const moodFeedback = $('[data-mood-feedback]');
  const moodKey = 'infinity-demo-daily-mood';
  const todayKey = new Date().toISOString().slice(0, 10);

  const renderMood = (button, announce=false) => {
    if (!button) return;
    moodButtons.forEach(item => item.classList.toggle('active', item === button));
    const label = button.dataset.mood;
    const level = Number(button.dataset.moodLevel || 3);
    if (moodFeedback) {
      moodFeedback.classList.toggle('alert', level <= 2);
      const icon = moodFeedback.querySelector('span');
      const paragraph = moodFeedback.querySelector('p');
      if (level <= 2) {
        if (icon) icon.textContent = '♡';
        if (paragraph) paragraph.innerHTML = `<strong>Obrigado por contar como você está.</strong> Você pode conversar com a Abby, falar com a coordenação ou usar o canal anônimo.`;
      } else if (level === 3) {
        if (icon) icon.textContent = '◌';
        if (paragraph) paragraph.innerHTML = `<strong>Check-in registrado neste aparelho.</strong> Está tudo bem não conseguir definir exatamente como você se sente.`;
      } else {
        if (icon) icon.textContent = '✓';
        if (paragraph) paragraph.innerHTML = `<strong>Que bom saber disso!</strong> Sua resposta contribui somente para uma visão geral do bem-estar da escola.`;
      }
    }
    try { localStorage.setItem(moodKey, JSON.stringify({date: todayKey, label, level})); } catch (e) {}
    if (announce && window.showToast) window.showToast(`Check-in de hoje: ${label}.`);
  };

  moodButtons.forEach(button => button.addEventListener('click', () => renderMood(button, true)));
  try {
    const saved = JSON.parse(localStorage.getItem(moodKey) || 'null');
    if (saved && saved.date === todayKey) {
      renderMood(moodButtons.find(btn => btn.dataset.mood === saved.label));
    }
  } catch (e) {}

  // Student chat contact switcher and visual message flow
  const chatContactButtons = $$('[data-chat-contact]');
  const chatPanels = $$('[data-chat-panel]');
  const activateChat = (name) => {
    chatContactButtons.forEach(button => button.classList.toggle('active', button.dataset.chatContact === name));
    chatPanels.forEach(panel => { panel.hidden = panel.dataset.chatPanel !== name; });
    const activeInput = $(`[data-chat-input="${name}"]`);
    if (activeInput) setTimeout(() => activeInput.focus(), 80);
  };
  chatContactButtons.forEach(button => button.addEventListener('click', () => activateChat(button.dataset.chatContact)));
  if (location.hash === '#coordenacao' || location.hash === '#coordinator') activateChat('coordinator');

  const appendChatMessage = (kind, text, mode) => {
    const container = $(`[data-chat-messages="${mode}"]`);
    if (!container) return;
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${kind}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    const time = document.createElement('small');
    time.textContent = 'Agora';
    wrapper.append(bubble, time);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
    return wrapper;
  };

  const assistantReply = (message) => {
    const normalized = message.toLowerCase();
    if (/ansios|nervos|prova|medo/.test(normalized)) {
      return 'Entendi. Vamos por partes: inspire devagar pelo nariz, segure por alguns segundos e solte lentamente. Também posso mostrar um vídeo curto de respiração na biblioteca.';
    }
    if (/bullying|ameaça|agress|abuso|machuc|perigo/.test(normalized)) {
      return 'Sinto muito que você esteja passando por isso. Para que um adulto responsável possa ajudar, converse com a coordenação ou envie um relato pelo canal anônimo. Se houver perigo agora, procure imediatamente um adulto de confiança.';
    }
    if (/triste|sozinh|mal|chor/.test(normalized)) {
      return 'Obrigado por dividir isso comigo. Você não precisa lidar com tudo sozinho. Posso ajudar a organizar o que você está sentindo ou encaminhar você para conversar com a coordenação.';
    }
    return 'Estou aqui para ouvir. Você pode contar um pouco mais sobre o que aconteceu ou escolher um dos conteúdos da biblioteca que combine com o seu momento.';
  };

  $$('[data-chat-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const mode = form.dataset.chatForm;
      const input = $(`[data-chat-input="${mode}"]`);
      if (!input || !input.value.trim()) return;
      const message = input.value.trim();
      appendChatMessage('sent', message, mode);
      input.value = '';
      input.style.height = '';
      if (mode === 'assistant') {
        setTimeout(() => appendChatMessage('received', assistantReply(message), mode), 650);
      } else {
        setTimeout(() => appendChatMessage('received', 'Mensagem recebida neste protótipo. Na versão final, a coordenação poderá responder por este canal protegido.', mode), 800);
      }
    });
  });

  $$('[data-chat-suggestion]').forEach(button => button.addEventListener('click', () => {
    const input = $('[data-chat-input="assistant"]');
    if (!input) return;
    input.value = button.dataset.chatSuggestion;
    input.focus();
  }));

  $$('[data-chat-input]').forEach(textarea => textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 110)}px`;
  }));

  // Profile visual editing
  const editToggle = $('[data-profile-edit-toggle]');
  const editCancel = $('[data-profile-edit-cancel]');
  const profileView = $('[data-profile-view]');
  const profileForm = $('[data-profile-form]');
  const setEditing = (editing) => {
    if (profileView) profileView.hidden = editing;
    if (profileForm) profileForm.hidden = !editing;
    if (editToggle) editToggle.textContent = editing ? 'Editando' : 'Editar';
  };
  if (editToggle) editToggle.addEventListener('click', () => setEditing(true));
  if (editCancel) editCancel.addEventListener('click', () => setEditing(false));
  if (profileForm) profileForm.addEventListener('submit', event => {
    event.preventDefault();
    setEditing(false);
    if (window.showToast) window.showToast('Alterações salvas apenas neste protótipo visual.');
  });

  const photoInput = $('[data-profile-photo-input]');
  const photoPreview = $('[data-profile-preview]');
  const photoInitials = $('[data-profile-initials]');
  if (photoInput && photoPreview) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        if (window.showToast) window.showToast('Escolha um arquivo de imagem.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        photoPreview.src = reader.result;
        photoPreview.hidden = false;
        if (photoInitials) photoInitials.hidden = true;
        if (window.showToast) window.showToast('Foto atualizada neste aparelho.');
      };
      reader.readAsDataURL(file);
    });
  }

  $$('[data-demo-toggle]').forEach(toggle => toggle.addEventListener('change', () => {
    if (window.showToast) window.showToast('Preferência alterada apenas para demonstração.');
  }));

  // Demonstrative video player modal
  const videoModal = $('#video-modal');
  const videoTitle = $('#video-modal-title');
  const videoTotal = $('[data-video-total]');
  const videoCurrent = $('[data-video-current]');
  const videoProgress = $('[data-video-progress]');
  const videoToggle = $('[data-video-toggle]');
  let videoTimer = null;
  let videoSeconds = 0;
  let videoDuration = 192;
  let playing = false;

  const parseDuration = (value='03:12') => {
    const parts = value.split(':').map(Number);
    return parts.length === 2 ? parts[0] * 60 + parts[1] : 192;
  };
  const formatTime = seconds => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  const updateVideoUI = () => {
    if (videoCurrent) videoCurrent.textContent = formatTime(videoSeconds);
    if (videoProgress) videoProgress.style.width = `${Math.min(100,(videoSeconds/videoDuration)*100)}%`;
    if (videoToggle) videoToggle.textContent = playing ? 'Ⅱ' : '▶';
  };
  const stopVideoTimer = () => {
    clearInterval(videoTimer);
    videoTimer = null;
    playing = false;
    updateVideoUI();
  };
  const closeVideo = () => {
    if (!videoModal) return;
    stopVideoTimer();
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden','true');
  };
  const openVideo = (title, duration) => {
    if (!videoModal) return;
    videoSeconds = 0;
    videoDuration = parseDuration(duration);
    playing = false;
    if (videoTitle) videoTitle.textContent = title;
    if (videoTotal) videoTotal.textContent = duration;
    updateVideoUI();
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden','false');
  };

  $$('[data-video-open]').forEach(button => button.addEventListener('click', () => openVideo(button.dataset.videoOpen, button.dataset.videoDuration || '03:12')));
  $$('[data-video-close]').forEach(button => button.addEventListener('click', closeVideo));
  if (videoModal) videoModal.addEventListener('click', event => { if (event.target === videoModal) closeVideo(); });
  if (videoToggle) videoToggle.addEventListener('click', () => {
    playing = !playing;
    clearInterval(videoTimer);
    if (playing) {
      videoTimer = setInterval(() => {
        videoSeconds += 1;
        if (videoSeconds >= videoDuration) {
          videoSeconds = videoDuration;
          stopVideoTimer();
        }
        updateVideoUI();
      }, 1000);
    }
    updateVideoUI();
  });
})();

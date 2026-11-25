// ============================================================================
// D&D 5E SPIRE II — PWA INSTALL & SERVICE WORKER CONTROLLER (pwa.js)
// Supports Chrome/Edge/Android native install prompt + iOS Safari Home Screen guide!
// ============================================================================
(function () {
  let deferredPrompt = null;

  function isStandalone() {
    return (
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true
    );
  }

  function isIosSafari() {
    const ua = window.navigator.userAgent || '';
    const isIos = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    return isIos && isSafari;
  }

  function setInstallButtonsVisible(visible, label = '📲 앱 설치') {
    document.querySelectorAll('.btn-pwa-install').forEach(btn => {
      if (visible && !isStandalone()) {
        btn.classList.remove('hidden');
        btn.textContent = label;
      } else {
        btn.classList.add('hidden');
      }
    });
  }

  async function triggerInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (outcome === 'accepted') {
        setInstallButtonsVisible(false);
        if (typeof Game !== 'undefined' && Game.showToast) {
          Game.showToast('🎉 앱 설치가 시작되었습니다! 홈 화면/바탕화면에서 바로 실행하세요.', 'success');
        }
      }
      return;
    }

    if (isIosSafari()) {
      const msg = "📱 iOS 앱 설치: Safari 하단 [공유 ⬆️] 버튼을 누른 뒤 ['홈 화면에 추가']를 선택하세요!";
      if (typeof Game !== 'undefined' && Game.showToast) {
        Game.showToast(msg, 'info');
      } else {
        alert(msg);
      }
      return;
    }

    const fallbackMsg =
      '📲 브라우저 주소창 오른쪽 [설치(⊕)] 아이콘 또는 메뉴 → [앱 설치 / 홈 화면에 추가]로 설치할 수 있습니다!';
    if (typeof Game !== 'undefined' && Game.showToast) {
      Game.showToast(fallbackMsg, 'info');
    }
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    setInstallButtonsVisible(true, '📲 앱 설치');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    setInstallButtonsVisible(false);
    if (typeof Game !== 'undefined' && Game.showToast) {
      Game.showToast('🎉 D&D SPIRE II 앱 설치 완료! 오프라인에서도 플레이 가능합니다.', 'success');
    }
  });

  // Register Service Worker for offline play & native PWA installability
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.warn('SW registration skipped:', err);
      });
    });
  }

  // On iOS Safari (or non-standalone), show Home Screen install button on load
  window.addEventListener('DOMContentLoaded', () => {
    if (isStandalone()) {
      setInstallButtonsVisible(false);
    } else if (isIosSafari()) {
      setInstallButtonsVisible(true, '📲 홈 화면 추가');
    }
  });

  window.PwaInstaller = {
    install: triggerInstall,
    isStandalone
  };
})();

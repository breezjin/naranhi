'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description?: string;
  disabled?: boolean;
}

export function useGlobalShortcuts() {
  const router = useRouter();

  // 단축키 설정 정의
  const shortcuts: ShortcutConfig[] = [
    {
      key: 'q',
      action: () => router.push('/admin'),
      description: 'Admin 페이지로 이동',
    },
    {
      key: 'h',
      action: () => router.push('/'),
      description: '홈페이지로 이동',
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 입력 필드에서는 단축키 비활성화
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          (activeElement as HTMLElement).isContentEditable ||
          activeElement.getAttribute('role') === 'textbox');

      if (isInputActive) {
        return;
      }

      // 모달이나 다이얼로그가 열려있는 경우 단축키 비활성화
      const hasOpenModal =
        document.querySelector('[role="dialog"]') ||
        document.querySelector('.modal') ||
        document.querySelector('[data-state="open"]');

      if (hasOpenModal) {
        return;
      }

      // 단축키 매칭 및 실행
      for (const shortcut of shortcuts) {
        if (shortcut.disabled) continue;

        const keyMatches =
          event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches =
          !shortcut.ctrlKey || event.ctrlKey === shortcut.ctrlKey;
        const altMatches = !shortcut.altKey || event.altKey === shortcut.altKey;
        const shiftMatches =
          !shortcut.shiftKey || event.shiftKey === shortcut.shiftKey;
        const metaMatches =
          !shortcut.metaKey || event.metaKey === shortcut.metaKey;

        if (
          keyMatches &&
          ctrlMatches &&
          altMatches &&
          shiftMatches &&
          metaMatches
        ) {
          event.preventDefault();
          event.stopPropagation();

          try {
            shortcut.action();
          } catch (error) {
            console.error('단축키 실행 중 오류:', error);
          }

          break;
        }
      }
    },
    [router]
  );

  useEffect(() => {
    // 키보드 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    // 클린업
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [handleKeyDown]);

  // 단축키 목록 반환 (도움말 등에서 사용 가능)
  const getShortcuts = useCallback(() => {
    return shortcuts
      .filter((s) => !s.disabled)
      .map((s) => ({
        key: s.key,
        description: s.description || '',
        modifiers: {
          ctrl: s.ctrlKey || false,
          alt: s.altKey || false,
          shift: s.shiftKey || false,
          meta: s.metaKey || false,
        },
      }));
  }, []);

  return {
    shortcuts: getShortcuts(),
  };
}

// 개별 단축키 훅 (특정 컴포넌트에서 사용)
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: {
    ctrlKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    metaKey?: boolean;
    disabled?: boolean;
  } = {}
) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (options.disabled) return;

      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatches = !options.ctrlKey || event.ctrlKey === options.ctrlKey;
      const altMatches = !options.altKey || event.altKey === options.altKey;
      const shiftMatches =
        !options.shiftKey || event.shiftKey === options.shiftKey;
      const metaMatches = !options.metaKey || event.metaKey === options.metaKey;

      if (
        keyMatches &&
        ctrlMatches &&
        altMatches &&
        shiftMatches &&
        metaMatches
      ) {
        event.preventDefault();
        callback();
      }
    },
    [key, callback, options]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}

"use client";

import { useState } from "react";

type Props = {
  wechat: string;
  qqGroup: string;
  note: string;
};

export default function RecruitJoin({ wechat, qqGroup, note }: Props) {
  const [qrOk, setQrOk] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* 剪贴板不可用时静默忽略 */
    }
  };

  const hasContact = wechat || qqGroup;

  return (
    <section className="mt-7 rounded-2xl border border-ink-700 bg-ink-850 p-5">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-200">
        <span className="h-3.5 w-[3px] rounded-full bg-gold-500" />
        怎么加入
      </h2>

      {/* 群二维码：把图片命名为 recruit-qr.png 放进 public/ 即可显示 */}
      <div className="flex justify-center">
        {qrOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/recruit-qr.png"
            alt="加群二维码"
            onError={() => setQrOk(false)}
            className="h-44 w-44 rounded-xl border border-ink-700 bg-white object-cover"
          />
        ) : (
          <div className="flex h-44 w-44 flex-col items-center justify-center rounded-xl border border-dashed border-ink-700 bg-ink-900 p-4 text-center">
            <p className="text-[12px] leading-relaxed text-ink-400">
              将群二维码命名为
              <br />
              <code className="text-gold-400">recruit-qr.png</code>
              <br />
              放入 public/ 目录即可显示
            </p>
          </div>
        )}
      </div>

      {/* 联系方式：留空则不显示对应行 */}
      {hasContact && (
        <div className="mt-4 space-y-2">
          {wechat && (
            <button
              type="button"
              onClick={() => copy("wechat", wechat)}
              className="flex w-full items-center justify-between rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-left transition-colors active:border-gold-500/50"
            >
              <span className="text-[13px] text-ink-200">
                微信号：<span className="text-gold-400">{wechat}</span>
              </span>
              <span className="text-[11px] text-ink-400">
                {copied === "wechat" ? "已复制" : "点击复制"}
              </span>
            </button>
          )}
          {qqGroup && (
            <button
              type="button"
              onClick={() => copy("qq", qqGroup)}
              className="flex w-full items-center justify-between rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-left transition-colors active:border-gold-500/50"
            >
              <span className="text-[13px] text-ink-200">
                QQ 群：<span className="text-gold-400">{qqGroup}</span>
              </span>
              <span className="text-[11px] text-ink-400">
                {copied === "qq" ? "已复制" : "点击复制"}
              </span>
            </button>
          )}
        </div>
      )}

      <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-400">
        {note}
      </p>
    </section>
  );
}

/* eslint-disable tailwindcss/no-custom-classname */
import { cn } from '@/lib/utils';

export default function NonReimbursement() {
  return (
    <main
      className={cn(
        'min-h-[calc(100vh-65px)] w-full p-8',
        'flex justify-center gap-8',
        'max-lg:flex-col'
      )}
    >
      <div>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <title>비급여항목 안내</title>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n/* cspell:disable-file */\n/* webkit printing magic: print all background colors */\na,\na.visited {\n\tcolor: inherit;\n\ttext-decoration: underline;\n}\n\n.pdf-relative-link-path {\n\tfont-size: 80%;\n\tcolor: #444;\n}\n\nh1,\nh2,\nh3 {\n\tletter-spacing: -0.01em;\n\tline-height: 1.2;\n\tfont-weight: 600;\n\tmargin-bottom: 0;\n}\n\n.page-title {\n\tfont-size: 2.5rem;\n\tfont-weight: 700;\n\tmargin-top: 0;\n\tmargin-bottom: 0.75em;\n}\n\nh1 {\n\tfont-size: 1.875rem;\n\tmargin-top: 1.875rem;\n}\n\nh2 {\n\tfont-size: 1.5rem;\n\tmargin-top: 1.5rem;\n}\n\nh3 {\n\tfont-size: 1.25rem;\n\tmargin-top: 1.25rem;\n}\n\n.source {\n\tborder: 1px solid #ddd;\n\tborder-radius: 3px;\n\tpadding: 1.5em;\n\tword-break: break-all;\n}\n\n.callout {\n\tborder-radius: 3px;\n\tpadding: 1rem;\n}\n\nfigure {\n\tmargin: 1.25em 0;\n\tpage-break-inside: avoid;\n}\n\nfigcaption {\n\topacity: 0.5;\n\tfont-size: 85%;\n\tmargin-top: 0.5em;\n}\n\nmark {\n\tbackground-color: transparent;\n}\n\n.indented {\n\tpadding-left: 1.5em;\n}\n\nhr {\n\tbackground: transparent;\n\tdisplay: block;\n\twidth: 100%;\n\theight: 1px;\n\tvisibility: visible;\n\tborder: none;\n\tborder-bottom: 1px solid rgba(55, 53, 47, 0.09);\n}\n\nimg {\n\tmax-width: 100%;\n}\n\n@media only print {\n\timg {\n\t\tmax-height: 100vh;\n\t\tobject-fit: contain;\n\t}\n}\n\n@page {\n\tmargin: 1in;\n}\n\n.collection-content {\n\tfont-size: 0.875rem;\n}\n\n.column-list {\n\tdisplay: flex;\n\tjustify-content: space-between;\n}\n\n.column {\n\tpadding: 0 1em;\n}\n\n.column:first-child {\n\tpadding-left: 0;\n}\n\n.column:last-child {\n\tpadding-right: 0;\n}\n\n.table_of_contents-item {\n\tdisplay: block;\n\tfont-size: 0.875rem;\n\tline-height: 1.3;\n\tpadding: 0.125rem;\n}\n\n.table_of_contents-indent-1 {\n\tmargin-left: 1.5rem;\n}\n\n.table_of_contents-indent-2 {\n\tmargin-left: 3rem;\n}\n\n.table_of_contents-indent-3 {\n\tmargin-left: 4.5rem;\n}\n\n.table_of_contents-link {\n\ttext-decoration: none;\n\topacity: 0.7;\n\tborder-bottom: 1px solid rgba(55, 53, 47, 0.18);\n}\n\ntable,\nth,\ntd {\n\tborder: 1px solid rgba(55, 53, 47, 0.09);\n\tborder-collapse: collapse;\n}\n\ntable {\n\tborder-left: none;\n\tborder-right: none;\n}\n\nth,\ntd {\n\tfont-weight: normal;\n\tpadding: 0.25em 0.5em;\n\tline-height: 1.5;\n\tmin-height: 1.5em;\n\ttext-align: left;\n}\n\nth {\n\tcolor: rgba(55, 53, 47, 0.6);\n}\n\nol,\nul {\n\tmargin: 0;\n\tmargin-block-start: 0.6em;\n\tmargin-block-end: 0.6em;\n}\n\nli > ol:first-child,\nli > ul:first-child {\n\tmargin-block-start: 0.6em;\n}\n\nul > li {\n\tlist-style: disc;\n}\n\nul.to-do-list {\n\tpadding-inline-start: 0;\n}\n\nul.to-do-list > li {\n\tlist-style: none;\n}\n\n.to-do-children-checked {\n\ttext-decoration: line-through;\n\topacity: 0.375;\n}\n\nul.toggle > li {\n\tlist-style: none;\n}\n\nul {\n\tpadding-inline-start: 1.7em;\n}\n\nul > li {\n\tpadding-left: 0.1em;\n}\n\nol {\n\tpadding-inline-start: 1.6em;\n}\n\nol > li {\n\tpadding-left: 0.2em;\n}\n\n.mono ol {\n\tpadding-inline-start: 2em;\n}\n\n.mono ol > li {\n\ttext-indent: -0.4em;\n}\n\n.toggle {\n\tpadding-inline-start: 0em;\n\tlist-style-type: none;\n}\n\n/* Indent toggle children */\n.toggle > li > details {\n\tpadding-left: 1.7em;\n}\n\n.toggle > li > details > summary {\n\tmargin-left: -1.1em;\n}\n\n.selected-value {\n\tdisplay: inline-block;\n\tpadding: 0 0.5em;\n\tbackground: rgba(206, 205, 202, 0.5);\n\tborder-radius: 3px;\n\tmargin-right: 0.5em;\n\tmargin-top: 0.3em;\n\tmargin-bottom: 0.3em;\n\twhite-space: nowrap;\n}\n\n.collection-title {\n\tdisplay: inline-block;\n\tmargin-right: 1em;\n}\n\n.page-description {\n    margin-bottom: 2em;\n}\n\n.simple-table {\n\tmargin-top: 1em;\n\tfont-size: 0.875rem;\n\tempty-cells: show;\n}\n.simple-table td {\n\theight: 29px;\n\tmin-width: 120px;\n}\n\n.simple-table th {\n\theight: 29px;\n\tmin-width: 120px;\n}\n\n.simple-table-header-color {\n\tbackground: rgb(247, 246, 243);\n\tcolor: black;\n}\n.simple-table-header {\n\tfont-weight: 500;\n}\n\ntime {\n\topacity: 0.5;\n}\n\n.icon {\n\tdisplay: inline-block;\n\tmax-width: 1.2em;\n\tmax-height: 1.2em;\n\ttext-decoration: none;\n\tvertical-align: text-bottom;\n\tmargin-right: 0.5em;\n}\n\nimg.icon {\n\tborder-radius: 3px;\n}\n\n.user-icon {\n\twidth: 1.5em;\n\theight: 1.5em;\n\tborder-radius: 100%;\n\tmargin-right: 0.5rem;\n}\n\n.user-icon-inner {\n\tfont-size: 0.8em;\n}\n\n.text-icon {\n\tborder: 1px solid #000;\n\ttext-align: center;\n}\n\n.page-cover-image {\n\tdisplay: block;\n\tobject-fit: cover;\n\twidth: 100%;\n\tmax-height: 30vh;\n}\n\n.page-header-icon {\n\tfont-size: 3rem;\n\tmargin-bottom: 1rem;\n}\n\n.page-header-icon-with-cover {\n\tmargin-top: -0.72em;\n\tmargin-left: 0.07em;\n}\n\n.page-header-icon img {\n\tborder-radius: 3px;\n}\n\n.link-to-page {\n\tmargin: 1em 0;\n\tpadding: 0;\n\tborder: none;\n\tfont-weight: 500;\n}\n\np > .user {\n\topacity: 0.5;\n}\n\ntd > .user,\ntd > time {\n\twhite-space: nowrap;\n}\n\ninput[type=\"checkbox\"] {\n\ttransform: scale(1.5);\n\tmargin-right: 0.6em;\n\tvertical-align: middle;\n}\n\np {\n\tmargin-top: 0.5em;\n\tmargin-bottom: 0.5em;\n}\n\n.image {\n\tborder: none;\n\tmargin: 1.5em 0;\n\tpadding: 0;\n\tborder-radius: 0;\n\ttext-align: center;\n}\n\n.code,\ncode {\n\tbackground: rgba(135, 131, 120, 0.15);\n\tborder-radius: 3px;\n\tpadding: 0.2em 0.4em;\n\tborder-radius: 3px;\n\tfont-size: 85%;\n\ttab-size: 2;\n}\n\ncode {\n\tcolor: #eb5757;\n}\n\n.code {\n\tpadding: 1.5em 1em;\n}\n\n.code-wrap {\n\twhite-space: pre-wrap;\n\tword-break: break-all;\n}\n\n.code > code {\n\tbackground: none;\n\tpadding: 0;\n\tfont-size: 100%;\n\tcolor: inherit;\n}\n\nblockquote {\n\tfont-size: 1.25em;\n\tmargin: 1em 0;\n\tpadding-left: 1em;\n\tborder-left: 3px solid rgb(55, 53, 47);\n}\n\n.bookmark {\n\ttext-decoration: none;\n\tmax-height: 8em;\n\tpadding: 0;\n\tdisplay: flex;\n\twidth: 100%;\n\talign-items: stretch;\n}\n\n.bookmark-title {\n\tfont-size: 0.85em;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\theight: 1.75em;\n\twhite-space: nowrap;\n}\n\n.bookmark-text {\n\tdisplay: flex;\n\tflex-direction: column;\n}\n\n.bookmark-info {\n\tflex: 4 1 180px;\n\tpadding: 12px 14px 14px;\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: space-between;\n}\n\n.bookmark-image {\n\twidth: 33%;\n\tflex: 1 1 180px;\n\tdisplay: block;\n\tposition: relative;\n\tobject-fit: cover;\n\tborder-radius: 1px;\n}\n\n.bookmark-description {\n\tcolor: rgba(55, 53, 47, 0.6);\n\tfont-size: 0.75em;\n\toverflow: hidden;\n\tmax-height: 4.5em;\n\tword-break: break-word;\n}\n\n.bookmark-href {\n\tfont-size: 0.75em;\n\tmargin-top: 0.25em;\n}\n\n.sans { font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, \"Apple Color Emoji\", Arial, sans-serif, \"Segoe UI Emoji\", \"Segoe UI Symbol\"; }\n.code { font-family: \"SFMono-Regular\", Menlo, Consolas, \"PT Mono\", \"Liberation Mono\", Courier, monospace; }\n.serif { font-family: Lyon-Text, Georgia, ui-serif, serif; }\n.mono { font-family: iawriter-mono, Nitti, Menlo, Courier, monospace; }\n.pdf .sans { font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, \"Apple Color Emoji\", Arial, sans-serif, \"Segoe UI Emoji\", \"Segoe UI Symbol\", 'Twemoji', 'Noto Color Emoji', 'Noto Sans CJK JP'; }\n.pdf:lang(zh-CN) .sans { font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, \"Apple Color Emoji\", Arial, sans-serif, \"Segoe UI Emoji\", \"Segoe UI Symbol\", 'Twemoji', 'Noto Color Emoji', 'Noto Sans CJK SC'; }\n.pdf:lang(zh-TW) .sans { font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, \"Apple Color Emoji\", Arial, sans-serif, \"Segoe UI Emoji\", \"Segoe UI Symbol\", 'Twemoji', 'Noto Color Emoji', 'Noto Sans CJK TC'; }\n.pdf:lang(ko-KR) .sans { font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, \"Apple Color Emoji\", Arial, sans-serif, \"Segoe UI Emoji\", \"Segoe UI Symbol\", 'Twemoji', 'Noto Color Emoji', 'Noto Sans CJK KR'; }\n.pdf .code { font-family: Source Code Pro, \"SFMono-Regular\", Menlo, Consolas, \"PT Mono\", \"Liberation Mono\", Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK JP'; }\n.pdf:lang(zh-CN) .code { font-family: Source Code Pro, \"SFMono-Regular\", Menlo, Consolas, \"PT Mono\", \"Liberation Mono\", Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK SC'; }\n.pdf:lang(zh-TW) .code { font-family: Source Code Pro, \"SFMono-Regular\", Menlo, Consolas, \"PT Mono\", \"Liberation Mono\", Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK TC'; }\n.pdf:lang(ko-KR) .code { font-family: Source Code Pro, \"SFMono-Regular\", Menlo, Consolas, \"PT Mono\", \"Liberation Mono\", Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK KR'; }\n.pdf .serif { font-family: PT Serif, Lyon-Text, Georgia, ui-serif, serif, 'Twemoji', 'Noto Color Emoji', 'Noto Serif CJK JP'; }\n.pdf:lang(zh-CN) .serif { font-family: PT Serif, Lyon-Text, Georgia, ui-serif, serif, 'Twemoji', 'Noto Color Emoji', 'Noto Serif CJK SC'; }\n.pdf:lang(zh-TW) .serif { font-family: PT Serif, Lyon-Text, Georgia, ui-serif, serif, 'Twemoji', 'Noto Color Emoji', 'Noto Serif CJK TC'; }\n.pdf:lang(ko-KR) .serif { font-family: PT Serif, Lyon-Text, Georgia, ui-serif, serif, 'Twemoji', 'Noto Color Emoji', 'Noto Serif CJK KR'; }\n.pdf .mono { font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK JP'; }\n.pdf:lang(zh-CN) .mono { font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK SC'; }\n.pdf:lang(zh-TW) .mono { font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK TC'; }\n.pdf:lang(ko-KR) .mono { font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK KR'; }\n.highlight-default {\n\tcolor: rgba(55, 53, 47, 1);\n}\n.highlight-gray {\n\tcolor: rgba(120, 119, 116, 1);\n\tfill: rgba(120, 119, 116, 1);\n}\n.highlight-brown {\n\tcolor: rgba(159, 107, 83, 1);\n\tfill: rgba(159, 107, 83, 1);\n}\n.highlight-orange {\n\tcolor: rgba(217, 115, 13, 1);\n\tfill: rgba(217, 115, 13, 1);\n}\n.highlight-yellow {\n\tcolor: rgba(203, 145, 47, 1);\n\tfill: rgba(203, 145, 47, 1);\n}\n.highlight-teal {\n\tcolor: rgba(68, 131, 97, 1);\n\tfill: rgba(68, 131, 97, 1);\n}\n.highlight-blue {\n\tcolor: rgba(51, 126, 169, 1);\n\tfill: rgba(51, 126, 169, 1);\n}\n.highlight-purple {\n\tcolor: rgba(144, 101, 176, 1);\n\tfill: rgba(144, 101, 176, 1);\n}\n.highlight-pink {\n\tcolor: rgba(193, 76, 138, 1);\n\tfill: rgba(193, 76, 138, 1);\n}\n.highlight-red {\n\tcolor: rgba(212, 76, 71, 1);\n\tfill: rgba(212, 76, 71, 1);\n}\n.highlight-gray_background {\n\tbackground: rgba(241, 241, 239, 1);\n}\n.highlight-brown_background {\n\tbackground: rgba(244, 238, 238, 1);\n}\n.highlight-orange_background {\n\tbackground: rgba(251, 236, 221, 1);\n}\n.highlight-yellow_background {\n\tbackground: rgba(251, 243, 219, 1);\n}\n.highlight-teal_background {\n\tbackground: rgba(237, 243, 236, 1);\n}\n.highlight-blue_background {\n\tbackground: rgba(231, 243, 248, 1);\n}\n.highlight-purple_background {\n\tbackground: rgba(244, 240, 247, 0.8);\n}\n.highlight-pink_background {\n\tbackground: rgba(249, 238, 243, 0.8);\n}\n.highlight-red_background {\n\tbackground: rgba(253, 235, 236, 1);\n}\n.block-color-default {\n\tcolor: inherit;\n\tfill: inherit;\n}\n.block-color-gray {\n\tcolor: rgba(120, 119, 116, 1);\n\tfill: rgba(120, 119, 116, 1);\n}\n.block-color-brown {\n\tcolor: rgba(159, 107, 83, 1);\n\tfill: rgba(159, 107, 83, 1);\n}\n.block-color-orange {\n\tcolor: rgba(217, 115, 13, 1);\n\tfill: rgba(217, 115, 13, 1);\n}\n.block-color-yellow {\n\tcolor: rgba(203, 145, 47, 1);\n\tfill: rgba(203, 145, 47, 1);\n}\n.block-color-teal {\n\tcolor: rgba(68, 131, 97, 1);\n\tfill: rgba(68, 131, 97, 1);\n}\n.block-color-blue {\n\tcolor: rgba(51, 126, 169, 1);\n\tfill: rgba(51, 126, 169, 1);\n}\n.block-color-purple {\n\tcolor: rgba(144, 101, 176, 1);\n\tfill: rgba(144, 101, 176, 1);\n}\n.block-color-pink {\n\tcolor: rgba(193, 76, 138, 1);\n\tfill: rgba(193, 76, 138, 1);\n}\n.block-color-red {\n\tcolor: rgba(212, 76, 71, 1);\n\tfill: rgba(212, 76, 71, 1);\n}\n.block-color-gray_background {\n\tbackground: rgba(241, 241, 239, 1);\n}\n.block-color-brown_background {\n\tbackground: rgba(244, 238, 238, 1);\n}\n.block-color-orange_background {\n\tbackground: rgba(251, 236, 221, 1);\n}\n.block-color-yellow_background {\n\tbackground: rgba(251, 243, 219, 1);\n}\n.block-color-teal_background {\n\tbackground: rgba(237, 243, 236, 1);\n}\n.block-color-blue_background {\n\tbackground: rgba(231, 243, 248, 1);\n}\n.block-color-purple_background {\n\tbackground: rgba(244, 240, 247, 0.8);\n}\n.block-color-pink_background {\n\tbackground: rgba(249, 238, 243, 0.8);\n}\n.block-color-red_background {\n\tbackground: rgba(253, 235, 236, 1);\n}\n.select-value-color-interactiveBlue { background-color: rgba(35, 131, 226, .07); }\n.select-value-color-pink { background-color: rgba(245, 224, 233, 1); }\n.select-value-color-purple { background-color: rgba(232, 222, 238, 1); }\n.select-value-color-green { background-color: rgba(219, 237, 219, 1); }\n.select-value-color-gray { background-color: rgba(227, 226, 224, 1); }\n.select-value-color-translucentGray { background-color: rgba(255, 255, 255, 0.0375); }\n.select-value-color-orange { background-color: rgba(250, 222, 201, 1); }\n.select-value-color-brown { background-color: rgba(238, 224, 218, 1); }\n.select-value-color-red { background-color: rgba(255, 226, 221, 1); }\n.select-value-color-yellow { background-color: rgba(253, 236, 200, 1); }\n.select-value-color-blue { background-color: rgba(211, 229, 239, 1); }\n.select-value-color-pageGlass { background-color: undefined; }\n.select-value-color-washGlass { background-color: undefined; }\n\n.checkbox {\n\tdisplay: inline-flex;\n\tvertical-align: text-bottom;\n\twidth: 16;\n\theight: 16;\n\tbackground-size: 16px;\n\tmargin-left: 2px;\n\tmargin-right: 5px;\n}\n\n.checkbox-on {\n\tbackground-image: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2358A9D7%22%2F%3E%0A%3Cpath%20d%3D%22M6.71429%2012.2852L14%204.9995L12.7143%203.71436L6.71429%209.71378L3.28571%206.2831L2%207.57092L6.71429%2012.2852Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E\");\n}\n\n.checkbox-off {\n\tbackground-image: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20x%3D%220.75%22%20y%3D%220.75%22%20width%3D%2214.5%22%20height%3D%2214.5%22%20fill%3D%22white%22%20stroke%3D%22%2336352F%22%20stroke-width%3D%221.5%22%2F%3E%0A%3C%2Fsvg%3E\");\n}\n\t\n",
          }}
        />
        <div
          id="497aa59f-4bf9-4f5a-976a-bbcba0789652"
          className={cn('page sans')}
        >
          <header>
            <h1 className={cn('page-title')}>비급여항목 안내</h1>
            <p className={cn('page-description')} />
          </header>
          <div className={cn('page-body')}>
            <table
              id="663856cd-adbd-4898-b616-29f5f4ba8719"
              className={cn('simple-table')}
            >
              <tbody>
                <tr id="266bd309-91b3-43ac-8d80-b61cf651d1d4">
                  <td id="NNib">코드</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    제증명
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    비용(원)
                  </td>
                  <td id="LkLY" style={{ width: '121px' }}>
                    최종변경일
                  </td>
                </tr>
                <tr id="cf56e8d5-0a01-4136-a87f-5bc27a458c98">
                  <td id="NNib">PDZ010000</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    일반진단서
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    20,000
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="9c21746b-efa7-46ad-aff7-f413d0328779">
                  <td id="NNib">PDZ010002</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    근로능력평가용 진단서
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    20,000
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="d3faeb12-43e5-4484-9cba-61e560485efb">
                  <td id="NNib">PDZ070002</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    장애진단서
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    40,000
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="6f21309f-0079-4358-9c2a-e300be10725a">
                  <td id="NNib">PDZ080000</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    병무용 진단서
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    30,000
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="62aaf768-e6b4-44a9-818f-b7407b75e698">
                  <td id="NNib">-</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    소견서
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    20,000
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="43fbfbaa-b160-4b0a-b271-716db446a103">
                  <td id="NNib">PDZ090004</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    통원확인서
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    3,000
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="84e17dca-4c39-4ac8-a9d3-2c4217c84f72">
                  <td id="NNib">PDZ090007</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    진료확인서
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    3,000
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="560b6760-e999-4b16-aef5-5e3d03f0d483">
                  <td id="NNib">PDZ110101</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    진료기록사본 (1~5매)
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    1,000 (1매당)
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="0282410f-cc0d-4b96-b47b-ca12285c6390">
                  <td id="NNib">PDZ110102</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    진료기록사본&nbsp;&nbsp; (6매 이상)
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    100 (1매당)
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="8796a650-2b61-4a63-9f91-41cdbfccf86b">
                  <td id="NNib">PDZ160000</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    제증명서 사본
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    1,000
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
                <tr id="2ce46b21-c567-4d8d-af98-fb08caaa98e1">
                  <td id="NNib">PDZ170000</td>
                  <td id="BoG>" style={{ width: '188.296875px' }}>
                    장애인증명서
                  </td>
                  <td id=":Uv@" style={{ width: '138px' }}>
                    1,000
                  </td>
                  <td id="LkLY" style={{ width: '121px' }} />
                </tr>
              </tbody>
            </table>
            <table
              id="6590af80-ea91-4cd1-b676-2f0b3f13e43b"
              className={cn('simple-table')}
            >
              <tbody>
                <tr id="bed5b468-6005-468b-abb9-5c061c304d23">
                  <td id="X`x|">코드</td>
                  <td id="`dfa" style={{ width: '187.10000610351562px' }}>
                    검사, 약물 및 치료
                  </td>
                  <td id="zk@x" style={{ width: '137.640625px' }}>
                    비용(원)
                  </td>
                  <td id="wqQH" style={{ width: '124px' }}>
                    최종변경일
                  </td>
                </tr>
                <tr id="fff14b60-8133-4984-9d1f-01f447f48c37">
                  <td id="X`x|">FY894</td>
                  <td id="`dfa" style={{ width: '187.10000610351562px' }}>
                    자율신경계이상검사 (HRV)
                  </td>
                  <td id="zk@x" style={{ width: '137.640625px' }}>
                    30,000
                  </td>
                  <td id="wqQH" style={{ width: '124px' }} />
                </tr>
                <tr id="6dae2a1a-b3f4-4dbd-9109-02c4265fdd61">
                  <td id="X`x|">FZ690</td>
                  <td id="`dfa" style={{ width: '187.10000610351562px' }}>
                    CAT 주의력검사
                  </td>
                  <td id="zk@x" style={{ width: '137.640625px' }}>
                    120,000
                  </td>
                  <td id="wqQH" style={{ width: '124px' }} />
                </tr>
                <tr id="e1a6ee8a-0746-4db4-84cc-e0027ea5766a">
                  <td id="X`x|">FY713</td>
                  <td id="`dfa" style={{ width: '187.10000610351562px' }}>
                    신경증우울평가
                  </td>
                  <td id="zk@x" style={{ width: '137.640625px' }}>
                    100,000
                  </td>
                  <td id="wqQH" style={{ width: '124px' }}>
                    -
                  </td>
                </tr>
                <tr id="fb29ef81-71f4-4351-80ac-c9794c22c308">
                  <td id="X`x|">FY737</td>
                  <td id="`dfa" style={{ width: '187.10000610351562px' }}>
                    이화방어기제
                  </td>
                  <td id="zk@x" style={{ width: '137.640625px' }}>
                    100,000
                  </td>
                  <td id="wqQH" style={{ width: '124px' }} />
                </tr>
                <tr id="be8718b5-3915-49a5-b916-8825ea93488c">
                  <td id="X`x|">FY701</td>
                  <td id="`dfa" style={{ width: '187.10000610351562px' }}>
                    불안민감척도
                  </td>
                  <td id="zk@x" style={{ width: '137.640625px' }}>
                    50,000~100,000
                  </td>
                  <td id="wqQH" style={{ width: '124px' }} />
                </tr>
                <tr id="bb90c6d8-2d56-4831-9f04-a7129f1f83c2">
                  <td id="X`x|">FY705</td>
                  <td id="`dfa" style={{ width: '187.10000610351562px' }}>
                    신경증불안평가
                  </td>
                  <td id="zk@x" style={{ width: '137.640625px' }}>
                    50,000
                  </td>
                  <td id="wqQH" style={{ width: '124px' }} />
                </tr>
                <tr id="1e293cde-2539-4290-a884-550c0e4b70d8">
                  <td id="X`x|">FZ689</td>
                  <td id="`dfa" style={{ width: '187.10000610351562px' }}>
                    언어전반진단검사
                  </td>
                  <td id="zk@x" style={{ width: '137.640625px' }}>
                    230,000
                  </td>
                  <td id="wqQH" style={{ width: '124px' }} />
                </tr>
                <tr id="9220c5e7-5c87-4505-a0af-09f5d18693a7">
                  <td id="X`x|">MZ006</td>
                  <td id="`dfa" style={{ width: '187.10000610351562px' }}>
                    언어치료
                  </td>
                  <td id="zk@x" style={{ width: '137.640625px' }}>
                    80,000~100,000
                  </td>
                  <td id="wqQH" style={{ width: '124px' }} />
                </tr>
              </tbody>
            </table>
            <p id="c29dfa68-f7f9-4ba8-9473-5074fd43e1ef"></p>
          </div>
        </div>
      </div>
    </main>
  );
}

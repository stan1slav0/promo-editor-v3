function generateDynamicImgSrc(index) {
  // 1. Пытаемся найти активную категорию
  const activeCategoryBtn = document.querySelector('.category-wrap__link._active')

  // Если кнопка найдена — берем текст, если нет — по умолчанию 'finance'
  let category = 'finance'
  if (activeCategoryBtn) {
    category = activeCategoryBtn.textContent.trim().toLowerCase()
  }

  // 2. Инпут с названием (например, abdc123)
  const rawName = document.getElementById('fileName').value.trim() || 'PROMO'
  const promoName = rawName.replace(/\s+/g, '').toLowerCase()

  // 3. Регулярки для букв и цифр
  const prefixMatch = promoName.match(/[a-z]+/)
  const suffixMatch = promoName.match(/\d+/)

  const prefix = prefixMatch ? prefixMatch[0] : 'promo'
  const suffix = suffixMatch ? suffixMatch[0] : '0'

  if (category !== 'alpha') {
    return `https://storage.5th-elementagency.com/files/Promo/${category}/${prefix}/lift-${suffix}/img-${index}.jpg`
  } else {
    return `https://alphaonest.com/files/promo/${prefix}/lift-${suffix}/img-${index}.jpg`
  }
}

const prettier = window.prettier
const prettierPluginHtml = window.prettierPlugins.html

async function formatWithPrettier(htmlString) {
  try {
    let formatted = await window.prettier.format(htmlString, {
      parser: "html",
      plugins: window.prettierPlugins,
      printWidth: 120,
      tabWidth: 2,
      useTabs: false,
      singleAttributePerLine: false,
      bracketSameLine: true,
      htmlWhitespaceSensitivity: "ignore",
    })

    formatted = formatted.trim()

    formatted = formatted.replace(/(<[a-z0-9]+)\s+([^>]+?)\s*>/gi, (match, tag, attrs) => {
      const cleanAttrs = attrs.replace(/\s+/g, ' ').trim()
      return `${tag} ${cleanAttrs}>`
    })

    formatted = formatted.replace(/<br\s*\/?>/gi, '<br>')
    formatted = formatted.replace(/<br>\s+(?=<br>)/g, '<br>')

    formatted = formatted.replace(/\s+([.,!?:;])/g, '$1')

    formatted = formatted.replace(/(<a[^>]*>)([\s\S]*?)(<\/a>)/gi, (match, startTag, content, endTag) => {
      const cleanContent = content.replace(/\s+/g, ' ').trim()
      // Добавляем \u200B сразу после скобки >. 
      // Это позволит тексту упасть на новую строку, если тег слишком длинный.
      return `${startTag}\u200B${cleanContent}${endTag}`
    })

    return formatted
  } catch (e) {
    console.error("Ошибка Prettier:", e)
    return htmlString
  }
}

const blueColors = ['#0000FF', 'rgb\\(0,\\s*0,\\s*255\\)',
  '#CFE2F3', 'rgb\\(207,\\s*226,\\s*243\\)',
  '#9FC5E8', 'rgb\\(159,\\s*197,\\s*232\\)',
  '#6FA8DC', 'rgb\\(111,\\s*168,\\s*220\\)',
  '#3D85C6', 'rgb\\(61,\\s*133,\\s*198\\)',
  '#0B5394', 'rgb\\(11,\\s*83,\\s*148\\)',
  '#073763', 'rgb\\(7,\\s*55,\\s*99\\)',
  '#4A86E8', 'rgb\\(74,\\s*134,\\s*232\\)',
  '#C9DAF8', 'rgb\\(201,\\s*218,\\s*248\\)',
  '#A4C2F4', 'rgb\\(164,\\s*194,\\s*244\\)',
  '#6D9EEB', 'rgb\\(109,\\s*158,\\s*235\\)',
  '#1155CC', 'rgb\\(17,\\s*85,\\s*204\\)',
  '#1C4587', 'rgb\\(28,\\s*69,\\s*135\\)',
  '#3C78D8', 'rgb\\(60,\\s*120,\\s*216\\)',
  '#467886', 'rgb\\(70,\\s*120,\\s*134\\)',
  '#0033CC', 'rgb\\(0,\\s*51,\\s*204\\)',
  '#0066B3', 'rgb\\(0,\\s*102,\\s*179\\)']

function italicLinks(htmlContent) {
  htmlContent = htmlContent.replace(/<a[^>]*>/gi, '').replace(/<\/a>/gi, '')
  blueColors.forEach((color, index) => {
    const regex = new RegExp(`<span[^>]*style="[^"]*color:\\s*${color}[^"]*;[^"]*font-style:\\s*italic[^"]*"[^>]*>(.*?)<\\/span>`, 'gi')
    htmlContent = htmlContent.replace(regex,
      '<a href="urlhere" style="font-family:\'Roboto\', Arial, Helvetica, sans-serif;text-decoration: underline;font-weight: 700; color: #0000EE;"><em>$1</em></a>'
    )
  })

  return htmlContent
}

function linksStyles(htmlContent) {
  blueColors.forEach((color, index) => {
    const reg = new RegExp(`<span[^>]*style="[^"]*color:\\s*(${color})[^"]*"[^>]*>(.*?)<\\/span>`, 'gi')
    htmlContent = htmlContent.replace(reg,
      '<a href="urlhere" style="font-family:\'Roboto\', Arial, Helvetica, sans-serif;text-decoration: underline;font-weight: 700; color: #0000EE;">$2</a>'
    )
  })

  return htmlContent
}

function replaceAllEmojisAndSymbolsExcludingHTML(htmlContent) {
  const rx = /(?:\p{Extended_Pictographic}|(?![<>=&%"'#;:_-])[\p{S}\p{No}])(?:\uFE0F)?/gu

  return htmlContent.replace(rx, match => {
    return Array.from(match)
      .map(ch => `&#${ch.codePointAt(0)};`)
      .join('')
  })
}

function processStyles(htmlContent) {
  htmlContent = htmlContent.replace(/<b[^>]*>/gi, '').replace(/<\/b>/gi, '')
  // i and b and u
  htmlContent = htmlContent.replace(/<span[^>]*style="[^"]*font-weight:\s*700[^"]*;[^"]*font-style:\s*italic[^"]*;[^"]*text-decoration-line:\s*underline[^"]*"[^>]*>(.*?)<\/span>/gi,
    '<em style="text-decoration: underline;font-weight: bold;">$1</em>')

  // i and u
  htmlContent = htmlContent.replace(/<span[^>]*style="[^"]*font-style:\s*italic[^"]*;[^"]*text-decoration-line:\s*underline[^"]*"[^>]*>(.*?)<\/span>/gi,
    '<em style="text-decoration: underline;">$1</em>')

  // i and b
  htmlContent = htmlContent.replace(/<span[^>]*style="[^"]*font-weight:\s*700[^"]*;[^"]*font-style:\s*italic[^"]*"[^>]*>(.*?)<\/span>/gi,
    '<b style="font-style: italic;">$1</b>')

  // b and u
  htmlContent = htmlContent.replace(/<span[^>]*style="[^"]*font-weight:\s*700[^"]*;[^"]*text-decoration-line:\s*underline[^"]*"[^>]*>(.*?)<\/span>/gi,
    '<b style="text-decoration: underline;">$1</b>')

  // u
  htmlContent = htmlContent.replace(/<span[^>]*style="[^"]*text-decoration-line:\s*underline[^"]*"[^>]*>(.*?)<\/span>/gi,
    '<u>$1</u>')

  // b
  htmlContent = htmlContent.replace(/<span[^>]*style="[^"]*font-weight:\s*700[^"]*"[^>]*>(.*?)<\/span>/gi, '<b>$1</b>')

  // i
  htmlContent = htmlContent.replace(/<span[^>]*style="[^"]*font-style:\s*italic[^"]*"[^>]*>(.*?)<\/span>/gi, '<em>$1</em>')


  //delete tags
  htmlContent = htmlContent.replace(/<a[^>]*>\s*<\/a>/g, ' ')
  htmlContent = htmlContent.replace(/<div[^>]*>/gi, '').replace(/<\/div>/gi, '')
  htmlContent = htmlContent.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '')
  htmlContent = htmlContent.replace(/<b>\s*<\/b>/g, '')

  //delete table tags update
  htmlContent = htmlContent.replace(/<table[^>]*>/gi, '').replace(/<\/table>/gi, '')
  htmlContent = htmlContent.replace(/<tbody[^>]*>/gi, '').replace(/<\/tbody>/gi, '')
  htmlContent = htmlContent.replace(/<tr[^>]*>/gi, '').replace(/<\/tr>/gi, '')
  htmlContent = htmlContent.replace(/<td[^>]*>/gi, '').replace(/<\/td>/gi, '')
  htmlContent = htmlContent.replace(/<col[^>]*>/gi, '').replace(/<\/col>/gi, '')
  htmlContent = htmlContent.replace(/<colgroup[^>]*>/gi, '').replace(/<\/colgroup>/gi, '')

  return htmlContent
}

function wrapSmallCenterTextHtml(htmlContent) {
  return htmlContent.replace(/<h6[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/h6>/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
            <tr>
                <td align="center" style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000; padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000;">
                    ${content}
                  </span>
                </td>
            </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapSmallTextHtml(htmlContent) {
  return htmlContent.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
            <tr>
                <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000; padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                    ${content}
                  </span>
                </td>
            </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapCenterHeadlineHtml(htmlContent) {
  return htmlContent.replace(/<h1[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/h1>/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
            <tr>
                <td align="center" style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:22px;font-style:normal;font-weight:bold;line-height:1.5;text-align:center;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <strong style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:22px;font-style:normal;font-weight:bold;line-height:1.5;text-align:center;color:#000000;">
                       ${content}
                  </strong>
                </td>
              </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapCenterQuoteHtml(htmlContent) {
  return htmlContent.replace(/<h4[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/h4>/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
            <tr>
                <td align="center" style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000; padding-left: 20px;padding-right: 20px;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000;">
                    ${content}
                  </span>
                </td>
            </tr> 
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapQuoteHtml(htmlContent) {
  return htmlContent.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
            <tr>
                <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000; padding-left: 20px;padding-right: 20px;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                    ${content}
                  </span>
                </td>
            </tr>            
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapHeadlineHtml(htmlContent) {
  return htmlContent.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
            <tr>
                <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:22px;font-style:normal;font-weight:bold;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <strong style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:22px;font-style:normal;font-weight:bold;line-height:1.5;text-align:left;color:#000000;">
                       ${content}
                  </strong>
                </td>
              </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapCenterTextHtml(htmlContent) {
  return htmlContent.replace(/<p[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
            <tr>
                <td align="center" style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                    <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000;">
                        ${content}
                    </span>
                </td>
            </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapButtonHtml(htmlContent) {
  return htmlContent.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
             <tr>
                <td align="center" style="padding-top: 14px; padding-bottom: 14px;">
                 
                  <table cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                           <td height="51" align="center" style="border-radius: 10px;font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;line-height:1.5;text-align:center;font-weight: bold; color: #FFFFFF; padding: 3px 5px; background-color: #28b628;" bgcolor="#28b628">
                               <a href="urlhere" target="_blank" style="font-weight: bold;text-decoration:none;color:#ffffff;padding: 9px 15px;display: block;font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;line-height:1.5;text-align:center;background-color: #28b628;border-radius: 10px;">
                                    ${content}           
                               </a>
                          </td>
                       </tr>
                  </table>
                </td>
              </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapRightSideImg(htmlContent) {
  return htmlContent.replace(/i-r-s([\s\S]*?)i-r-s-e/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
              <tr>
                <td align="left" style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-bottom: 14px; padding-top: 14px;">
                  <a align="right" href="urlhere" target="_blank" style="display: inline-block; float: right; width: 50%; max-width: 50%; margin-left: 18px; margin-bottom: 12px;">
                    <img alt="Preview" height="224"
                         align="right"
                         src="https://storage.5th-elementagency.com/"
                         style="border:0;display:inline-block;outline:none;text-decoration:none;height:auto;max-height: 224px;max-width: 100%; width: 100%;font-size:13px;object-fit: contain;"
                         width="250"/>
                  </a>
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                    ${content}
                  </span>
                </td>
              </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapLeftSideImg(htmlContent) {
  return htmlContent.replace(/i-l-s([\s\S]*?)i-l-s-e/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
              <tr>
                <td align="left" style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-bottom: 14px; padding-top: 14px;">
                  <a align="left" href="urlhere" target="_blank" style="display: inline-block; float: left; width: 50%; max-width: 50%; margin-right: 18px; margin-bottom: 12px;">
                    <img alt="Preview" height="224"
                         align="left"
                         src="https://storage.5th-elementagency.com/"
                         style="border:0;display:inline-block;outline:none;text-decoration:none;height:auto;max-height: 224px;max-width: 100%; width: 100%;font-size:13px;object-fit: contain;"
                         width="250"/>
                  </a>
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                    ${content}
                  </span>
                </td>
              </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapFooterBlock(htmlContent) {
  return htmlContent.replace(/ftr-s([\s\S]*?)ftr-e/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
            <tr>
              <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000; padding-top: 34px; padding-bottom: 14px;">
                <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                    ${content}
                </span>
              </td>
            </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapFooterCenterBlock(htmlContent) {
  return htmlContent.replace(/ftr-c([\s\S]*?)ftr-c-e/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
            <tr>
              <td align="center" style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000; padding-top: 34px; padding-bottom: 14px;">
                <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000;">
                    ${content}
                </span>
              </td>
            </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapSignatureImg(htmlContent) {
  return htmlContent.replace(/sign-i([\s\S]*?)sign-i-e/gi, function (match, content) {
    return `
                    </span>
                </td>
            </tr>
              <tr>
                <td class="img-bg-block" align="left" style="padding-top: 14px; padding-bottom: 14px;">
                  <img alt="Signature" height="auto"
                       src="https://storage.5th-elementagency.com/"
                       style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:200px;max-width: 100%;font-size:13px;"
                       width="200"/>
                </td>
              </tr>
            <tr>
               <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                  <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function addOneBr(htmlContent) {
  return htmlContent.replace(/ю/gi, function (match, content) {
    return `
                    <br>
        `
  })
}

function replaceTripleBrWithSingle(htmlContent) {
  const BR = `<br>\n`
  htmlContent = htmlContent.replace(
    /<\w+[^>]*>\s*<\w+[^>]*>\s*<br\s*\/?>\s*<\/\w+>\s*<\/\w+>/gi,
    BR
  )


  htmlContent = htmlContent.replace(
    /<\w+[^>]*>\s*<br\s*\/?>\s*<\/\w+>/gi,
    BR
  )

  htmlContent = htmlContent.replace(
    /\s*<br\s*\/?>\s*<\/(\w+)>/gi,
    '</$1><br>'
  )


  htmlContent = htmlContent.replace(/(?:<br\s*\/?>\s*){3,}/gi, BR)

  return htmlContent
}

function wrapSmallCenterTextMjml(htmlContent) {
  return htmlContent.replace(/<h6[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/h6>/gi, function (match, content) {
    return `
                    </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000;">
                            ${content}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapSmallTextMjml(htmlContent) {
  return htmlContent.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, function (match, content) {
    return `
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                            ${content}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapCenterHeadlineMjml(htmlContent) {
  return htmlContent.replace(/<h1[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/h1>/gi, function (match, content) {
    return `
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:22px;font-style:normal;font-weight:bold;line-height:1.5;text-align:center;color:#000000;">
                            ${content}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapHeadlineMjml(htmlContent) {
  return htmlContent.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, function (match, content) {
    return `
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:22px;font-style:normal;font-weight:bold;line-height:1.5;text-align:left;color:#000000;">
                            ${content}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapCenterQuoteMjml(htmlContent) {
  return htmlContent.replace(/<h4[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/h4>/gi, function (match, content) {
    return `
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 45px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000;">
                            ${content}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapQuoteMjml(htmlContent) {
  return htmlContent.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, function (match, content) {
    return `
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 45px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                            ${content}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapCenterTextMjml(htmlContent) {
  return htmlContent.replace(/<p[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, function (match, content) {
    return `
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000;">
                            ${content}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapButtonMjml(htmlContent) {
  return htmlContent.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, function (match, content) {
    return `
                       </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px; word-break:break-word;">
                        <table cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                              <td height="51" align="center" style="border-radius: 10px;font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;line-height:1.5;text-align:center;font-weight: bold; color: #FFFFFF; padding: 3px 5px; background-color: #28b628;" bgcolor="#28b628">
                                  <a href="urlhere" target="_blank" style="font-weight: bold;text-decoration:none;color:#ffffff;padding: 9px 15px;display: block;font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;line-height:1.5;text-align:center;background-color: #28b628;border-radius: 10px;">
                                       ${content}           
                                  </a>
                             </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapRightSideImgMjml(htmlContent) {
  return htmlContent.replace(/i-r-s([\s\S]*?)i-r-s-e/gi, function (match, content) {
    return `
                       </div>
                      </td>
                    </tr>
                    <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <table class="content-inner-table" border="0" cellspacing="0" role="presentation"
                                   cellpadding="0" width="100%" style="width: 100%;">
                                <tr>
                                    <td align="left" style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-bottom: 14px; padding-top: 14px;">
                                        <a align="right" href="urlhere" target="_blank" style="display: inline-block; float: right; width: 50%; max-width: 50%; margin-left: 18px; margin-bottom: 12px;">
                                            <img alt="Preview" height="224"
                                                 align="right"
                                                 src="https://storage.5th-elementagency.com/"
                                                 style="border:0;display:inline-block;outline:none;text-decoration:none;height:auto;max-height: 224px;max-width: 100%; width: 100%;font-size:13px;object-fit: contain;"
                                                 width="250"/>
                                        </a>
                                        <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                                        ${content}
                                      </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapLeftSideImgMjml(htmlContent) {
  return htmlContent.replace(/i-l-s([\s\S]*?)i-l-s-e/gi, function (match, content) {
    return `
                       </div>
                      </td>
                    </tr>
                    <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <table class="content-inner-table" border="0" cellspacing="0" role="presentation"
                                   cellpadding="0" width="100%" style="width: 100%;">
                                      <tr>
                                        <td align="left" style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-bottom: 14px; padding-top: 14px;">
                                          <a align="left" href="urlhere" target="_blank" style="display: inline-block; float: left; width: 50%; max-width: 50%; margin-right: 18px; margin-bottom: 12px;">
                                            <img alt="Preview" height="224"
                                                 align="left"
                                                 src="https://storage.5th-elementagency.com/"
                                                 style="border:0;display:inline-block;outline:none;text-decoration:none;height:auto;max-height: 224px;max-width: 100%; width: 100%;font-size:13px;object-fit: contain;"
                                                 width="250"/>
                                          </a>
                                          <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                                            ${content}
                                          </span>
                                        </td>
                                      </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapSignatureImgMjml(htmlContent) {
  return htmlContent.replace(/sign-i([\s\S]*?)sign-i-e/gi, function (match, content) {
    return `
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:180px;">
                                <img alt="Signature" src="https://storage.5th-elementagency.com/" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="180" height="auto" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapFooterBlockMjml(htmlContent) {
  return htmlContent.replace(/ftr-s([\s\S]*?)ftr-e/gi, function (match, content) {
    return `
                       </div>
                      </td>
                    </tr>
                      <tr>
                      <td align="left" style="font-size:0px;padding:30px 25px 10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                            ${content}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function wrapFooterCenterBlockMjml(htmlContent) {
  return htmlContent.replace(/ftr-c([\s\S]*?)ftr-c-e/gi, function (match, content) {
    return `
                       </div>
                      </td>
                    </tr>
                      <tr>
                      <td align="center" style="font-size:0px;padding:30px 25px 10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:1.5;text-align:center;color:#000000;">
                            ${content}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
        `
  })
}

function addBrAfterClosingP(htmlContent) {
  // Delete extra <br>
  htmlContent = htmlContent.replace(/<br\s*\/?>/gi, '')

  // Add <br><br>
  htmlContent = htmlContent.replace(/<\/p>(?!\s*<\/li>)/gi, '</p>\n<br><br>\n')

  // add <br> (ol, ul).
  htmlContent = htmlContent.replace(/<br><br>(\s*<(ol|ul)[^>]*>)/gi, '<br>\n$1')

  // Delete extra <p>
  htmlContent = htmlContent.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '')

  return htmlContent
}

function removeStylesFromLists(htmlContent) {
  htmlContent = htmlContent.replace(/<ol[^>]*style="[^"]*"[^>]*>/gi, '<ol>\n')
  htmlContent = htmlContent.replace(/<ul[^>]*style="[^"]*"[^>]*>/gi, '<ul>\n')
  htmlContent = htmlContent.replace(/<li[^>]*style="[^"]*"[^>]*>/gi, '<li>')
  htmlContent = htmlContent.replace(/<\/li*>/gi, '<\/li>\n')
  return htmlContent
}

function wrapTextInSpan(htmlContent) {
  htmlContent = htmlContent.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, function (match, src) {

    const dynamicSrc = generateDynamicImgSrc(window.currentImgIdx++)

    return `            </span>
                       </td>
                   </tr>
                   <tr>
                       <td class="img-bg-block" align="center" style="padding-top: 14px; padding-bottom: 14px;">
                           <a href="urlhere" target="_blank">
                               <img alt="click" height="auto"
                                    src="${dynamicSrc}"
                                    style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;max-width: 560px;font-size:13px;"
                                    width="560"/>
                           </a>
                       </td>
                    </tr>
                    <tr>
                       <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                            <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">`
  })

  // Обертка всей таблицы остается без изменений
  htmlContent = `<tr>
                      <td style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;padding-top: 14px; padding-bottom: 14px;">
                                <span style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                                    ${htmlContent}
                                </span>
                      </td>
                    </tr>`

  return htmlContent
}

function cleanEmptyHtmlTags(htmlContent) {
  htmlContent = htmlContent.replace(/&nbsp;/g, ' ')
  htmlContent = htmlContent.replace(/<b>\s*<\/b>/g, '')
  htmlContent = htmlContent.replace(/<li>\s*<\/li>/g, '')
  htmlContent = htmlContent.replace(/<br>\s*<br>\s*<br>\s*<br>/g, '<br><br>')
  htmlContent = htmlContent.replace(/<br>\s*<br>\s*<br>/g, '<br><br>')
  htmlContent = htmlContent.replace(/(<span[^>]*>)\s*<br><br>/gi, '$1')
  htmlContent = htmlContent.replace(/<\/a>\s*<a[^>]*>/g, ' ')
  htmlContent = htmlContent.replace(/<pre>/g, '')
  htmlContent = htmlContent.replace(/<a[^>]*>\s*<\/a>/g, ' ')
  htmlContent = htmlContent.replace(/<b[^>]*>\s*<\/b>/g, ' ')
  htmlContent = htmlContent.replace(/<u>\s*<\/u>/g, ' ')
  htmlContent = htmlContent.replace(/<em[^>]*>\s*<\/em>/g, ' ')
  htmlContent = htmlContent.replace(/<\/em>\s*<em[^>]*>/g, ' ')
  htmlContent = htmlContent.replace(/<a[^>]*>\s*<\/a>/g, ' ')
  htmlContent = htmlContent.replace(/<br><br>\s*<\/span>/g, '<\/span>')
  htmlContent = htmlContent.replace(/(<span[^>]*>)\s*<\/a>/gi, '$1')
  htmlContent = htmlContent.replace(/(<span[^>]*>)\s*<\/b>/gi, '$1')
  htmlContent = htmlContent.replace(/<a[^>]*>\s*<\/span>/g, '<\/span>')
  htmlContent = htmlContent.replace(/<b[^>]*>\s*<\/span>/g, '<\/span>')
  htmlContent = htmlContent.replace(/(<div[^>]*>)\s*<\/a>/gi, '$1')
  htmlContent = htmlContent.replace(/(<div[^>]*>)\s*<\/b>/gi, '$1')
  htmlContent = htmlContent.replace(/<a[^>]*>\s*<\/div>/g, '<\/div>')
  htmlContent = htmlContent.replace(/<b[^>]*>\s*<\/div>/g, '<\/div>')

  htmlContent = htmlContent.replace(/<h1[^>]*>/gi, '').replace(/<\/h1>/gi, '')
  htmlContent = htmlContent.replace(/<h2[^>]*>/gi, '').replace(/<\/h2>/gi, '')
  htmlContent = htmlContent.replace(/<h3[^>]*>/gi, '').replace(/<\/h3>/gi, '')
  htmlContent = htmlContent.replace(/<h4[^>]*>/gi, '').replace(/<\/h4>/gi, '')
  htmlContent = htmlContent.replace(/<h5[^>]*>/gi, '').replace(/<\/h5>/gi, '')
  htmlContent = htmlContent.replace(/<h6[^>]*>/gi, '').replace(/<\/h6>/gi, '')
  htmlContent = htmlContent.replace(/<br><br>\s*<br><br>/g, '<br><br>')
  htmlContent = htmlContent.replace(/<br><br>\s*<\/div>/g, '<\/div>')
  htmlContent = htmlContent.replace(/(<div[^>]*>)\s*<br><br>/gi, '$1')
  htmlContent = htmlContent.replace(/(<span[^>]*>)\s*<br><br>/gi, '$1')
  htmlContent = htmlContent.replace(/<br><br>\s*<\/span>/g, '<\/span>')
  htmlContent = htmlContent.replace(/(<div[^>]*>)\s*<br><br>/gi, '$1')
  htmlContent = htmlContent.replace(/<br><br>\s*<\/div>/g, '<\/div>')
  htmlContent = htmlContent.replace(/<br>\s*<\/div>/g, '<\/div>')
  htmlContent = htmlContent.replace(/<br>\s*<\/span>/g, '<\/span>')

  htmlContent = htmlContent.replace(/<span[^>]*>\s*<\/span>/g, '')
  htmlContent = htmlContent.replace(/<div[^>]*>\s*<\/div>/g, '')
  htmlContent = htmlContent.replace(/<td[^>]*>\s*<\/td>/g, '')
  htmlContent = htmlContent.replace(/<tr[^>]*>\s*<\/tr>/g, '')
  return htmlContent
}

function wrapContentInFullTableStructure(htmlContent) {
  const fullTableStructure = `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 100%;">
        <tr>
            <td align="center" valign="top">
                <table class="primary-table-limit content-table" bgcolor="#FFFFFF" border="0" cellspacing="0"
                       cellpadding="0" role="presentation" width="100%" style="max-width: 600px;">
                    <tr>
                        <td class="content-vertical-space" align="center" style="padding-left: 20px; padding-right: 20px;">
                            <table class="content-inner-table" border="0" cellspacing="0" role="presentation"
                                   cellpadding="0" width="100%" style="width: 100%;">
                                <tr>
                                    <td height="16" width="100%" style="max-width: 100%" class="md-horizontal-space"></td>
                                </tr>
                                ${htmlContent}
                                <tr>
                                    <td height="16" width="100%" style="max-width: 100%" class="md-horizontal-space"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`
  return fullTableStructure
}

async function exportHTML() {
  window.currentImgIdx = 1
  let editorContent = document.getElementById('editor').innerHTML
  editorContent = italicLinks(editorContent)
  editorContent = linksStyles(editorContent)
  editorContent = replaceAllEmojisAndSymbolsExcludingHTML(editorContent)
  editorContent = processStyles(editorContent)
  editorContent = wrapCenterTextHtml(editorContent)
  editorContent = wrapSmallCenterTextHtml(editorContent)
  editorContent = wrapSmallTextHtml(editorContent)
  editorContent = wrapCenterHeadlineHtml(editorContent)
  editorContent = wrapHeadlineHtml(editorContent)
  editorContent = wrapButtonHtml(editorContent)
  editorContent = wrapCenterQuoteHtml(editorContent)
  editorContent = wrapQuoteHtml(editorContent)
  editorContent = addBrAfterClosingP(editorContent)
  editorContent = removeStylesFromLists(editorContent)
  editorContent = wrapTextInSpan(editorContent)
  editorContent = wrapRightSideImg(editorContent)
  editorContent = wrapLeftSideImg(editorContent)
  editorContent = wrapSignatureImg(editorContent)
  editorContent = wrapFooterBlock(editorContent)
  editorContent = wrapFooterCenterBlock(editorContent)
  editorContent = cleanEmptyHtmlTags(editorContent)
  editorContent = wrapContentInFullTableStructure(editorContent)
  editorContent = addOneBr(editorContent)
  editorContent = replaceTripleBrWithSingle(editorContent)

  const prettyHtml = await formatWithPrettier(editorContent)

  document.getElementById('output').value = prettyHtml

  return prettyHtml

}

function downloadFile(content) {
  const fileName = document.getElementById('fileName').value.replace(/\s+/g, '').toUpperCase()

  const htmlContent = `${content}`
  const file = new Blob([htmlContent], { type: 'text/html' })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(file)

  a.download = `${fileName}_html.html`
  a.click()
  URL.revokeObjectURL(a.href)
}

document.getElementById("downloadBtn").addEventListener("click", async function () {
  try {
    const exportedContent = await exportHTML()

    downloadFile(exportedContent)
  } catch (error) {
    console.error("Ошибка при экспорте или скачивании:", error)
    alert("Что-то пошло не так при генерации файла.")
  }
})

document.getElementById("exportAll").addEventListener("click", async function () {
  try {
    await exportHTML()
    await exportMJML()

  } catch (error) {
    console.error("Ошибка при экспорте или скачивании:", error)
    alert("Что-то пошло не так при генерации файла.")
  }
})

function wrapTextInMjmlTags(htmlContent) {
  htmlContent = htmlContent.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, function (match, src) {

    const dynamicSrc = generateDynamicImgSrc(window.currentImgIdx++)

    return `       </div>
                      </td>
                    </tr>
                   <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:550px;">
                                <a href="urlhere" target="_blank">
                                  <img alt="click" src="${dynamicSrc}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550" height="auto" />
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                `
  })

  // Обертка основной секции
  htmlContent = `
            <tr>
              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                <div style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size:18px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left;color:#000000;">
                    ${htmlContent}
                </div>
              </td>
            </tr>
        `

  return htmlContent
}

function wrapContentInFullMjmlTableStructure(htmlContent) {
  const fullMjmlTableStructure = `
    <div style="background-color:#FFFFFF;">
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;" ><![endif]-->
                        <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                <tbody>
                                    ${htmlContent}
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>`
  return fullMjmlTableStructure
}

async function exportMJML() {
  window.currentImgIdx = 1
  let editorContent = document.getElementById('editor').innerHTML
  editorContent = italicLinks(editorContent)
  editorContent = linksStyles(editorContent)
  editorContent = replaceAllEmojisAndSymbolsExcludingHTML(editorContent)
  editorContent = processStyles(editorContent)
  editorContent = wrapCenterTextMjml(editorContent)
  editorContent = wrapSmallCenterTextMjml(editorContent)
  editorContent = wrapSmallTextMjml(editorContent)
  editorContent = wrapCenterHeadlineMjml(editorContent)
  editorContent = wrapHeadlineMjml(editorContent)
  editorContent = wrapCenterQuoteMjml(editorContent)
  editorContent = wrapQuoteMjml(editorContent)
  editorContent = wrapButtonMjml(editorContent)
  editorContent = addBrAfterClosingP(editorContent)
  editorContent = removeStylesFromLists(editorContent)
  editorContent = wrapTextInMjmlTags(editorContent)
  editorContent = wrapLeftSideImgMjml(editorContent)
  editorContent = wrapRightSideImgMjml(editorContent)
  editorContent = wrapSignatureImgMjml(editorContent)
  editorContent = wrapFooterBlockMjml(editorContent)
  editorContent = wrapFooterCenterBlockMjml(editorContent)
  editorContent = cleanEmptyHtmlTags(editorContent)
  editorContent = wrapContentInFullMjmlTableStructure(editorContent)
  editorContent = addOneBr(editorContent)
  editorContent = replaceTripleBrWithSingle(editorContent)

  const prettyMjml = await formatWithPrettier(editorContent)

  document.getElementById('mjmlOutput').value = prettyMjml

  return prettyMjml
}

function downloadMjmlFile(content) {

  const mjmlFileName = document
    .getElementById('fileName')
    .value
    .replace(/\s+/g, '')
    .toUpperCase()

  const htmlContent = `${content}`
  const file = new Blob([htmlContent], { type: 'text/html' })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(file)

  a.download = `${mjmlFileName}_mjml.html`
  a.click()

  URL.revokeObjectURL(a.href)
}

document.getElementById("mjmlDownloadBtn").addEventListener("click", async function () {
  try {
    const exportedContent = await exportMJML()

    downloadMjmlFile(exportedContent)
  } catch (error) {
    console.error("Ошибка при экспорте или скачивании:", error)
    alert("Что-то пошло не так при генерации файла.")
  }
})

document.querySelectorAll('.input-name').forEach(input => {
  input.addEventListener('click', function (event) {
    if (event.detail === 1) { // Only on single click
      this.select()
    }
  })
})

function changeNumber(amount) {
  let input = document.getElementById("fileName")
  let match = input.value.match(/(\D*)(\d+)/) // Match text and number separately

  if (match) {
    let textPart = match[1] // Non-numeric part (e.g., "SBJC ")
    let numberPart = parseInt(match[2]) || 0 // Numeric part (e.g., 123)
    numberPart += amount // Increment or decrement the number
    input.value = textPart + numberPart // Update input value
  }
}

function changeMjmlNumber(amount) {
  let input = document.getElementById("mjmlFileName")
  let match = input.value.match(/(\D*)(\d+)/) // Match text and number separately

  if (match) {
    let textPart = match[1] // Non-numeric part (e.g., "SBJC ")
    let numberPart = parseInt(match[2]) || 0 // Numeric part (e.g., 123)
    numberPart += amount // Increment or decrement the number
    input.value = textPart + numberPart // Update input value
  }
}

function copyTextHtml() {
  const copyText = document.getElementById("output")
  const button = document.getElementById("copyHtmlButton")


  copyText.select()
  copyText.setSelectionRange(0, 99999)


  navigator.clipboard.writeText(copyText.value).then(() => {
    button.innerText = "Copied!"

    setTimeout(() => {
      button.innerText = "Copy MJML"
    }, 2000)
  }).catch((err) => {
    alert("Copy error")
  })
}

function copyTextMjml() {
  const copyText = document.getElementById("mjmlOutput")
  const button = document.getElementById("copyMjmlButton")

  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value).then(() => {
    button.innerText = "Copied!"

    setTimeout(() => {
      button.innerText = "Copy MJML"
    }, 2000)
  }).catch((err) => {
    alert("Copy error")
  })
}

const editor = document.getElementById('editor')
const logEl = document.getElementById('log')
const bgPicker = document.getElementById('bgColor')
const folderInput = document.getElementById('fileName')

function log(msg) {
  logEl.textContent += msg + "\n"
}

function toKebab(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFKD')           // прибрати діакритики
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-') // все неалфанум → "-"
    .replace(/^-+|-+$/g, '')     // крайні дефіси
    .replace(/-{2,}/g, '-')     // злиплі дефіси
}

async function getBlobFromSrc(src) {
  try {
    const res = await fetch(src, { mode: 'cors' })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.blob()             // успіх — нічого не логуємо
  } catch (e) {
    log('⚠️ Не вдалося завантажити зображення: ' + src + ' — ' + e.message)
    return null
  }
}

async function toJpeg600(blob, bgColor = '#ffffff') {
  const bmp = await createImageBitmap(blob)
  const naturalW = bmp.width
  const naturalH = bmp.height
  const targetW = Math.min(600, naturalW)
  const targetH = Math.round(naturalH * (targetW / naturalW))

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, targetW, targetH)
  ctx.drawImage(bmp, 0, 0, targetW, targetH)
  // const qualityInput = document.getElementById('jpgQuality').value || 0.82
  const qualityInput = 0.82
  const outBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', parseFloat(qualityInput)))
  const wasDownscaled = targetW < naturalW
  return { outBlob, targetW, targetH, wasDownscaled }
}

async function downloadImagesFolder() {
  logEl.textContent = ''
  const imgs = Array.from(editor.querySelectorAll('img'))
  if (!imgs.length) return log('Немає <img> у редакторі.')

  const bg = '#ffffff'
  // const bg = bgPicker.value || '#ffffff'

  const rawName = document.getElementById('fileName').value || 'PROMO'
  const promoName = rawName.replace(/\s+/g, '').toUpperCase()

  let index = 1
  let saved = 0

  for (const img of imgs) {
    const src = img.getAttribute('src')
    if (!src) continue

    const blob = await getBlobFromSrc(src)
    if (!blob) {
      log('— Пропущено (помилка завантаження): ' + src)
      continue
    }

    const { outBlob } = await toJpeg600(blob, bg)

    const fileName = `${promoName}_img-${index}.jpg`

    if (typeof saveAs !== 'undefined') {
      saveAs(outBlob, fileName)
    } else {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(outBlob)
      link.download = fileName
      link.click()
      setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    }

    log(`${fileName}`)
    index++
    saved++

    await new Promise(resolve => setTimeout(resolve, 300))
  }

  if (saved === 0) {
    log('Немає зображень для збереження.')
  } else {
    log(`\n✅ Done! ${saved} images sent to ${promoName}`)
  }
}

document.getElementById('btn-download').addEventListener('click', downloadImagesFolder)
document.getElementById('mjmlDownloadBtn').addEventListener('click', downloadImagesFolder)

editor.addEventListener('paste', (e) => {
  const items = Array.from(e.clipboardData?.items || [])
  const hasFiles = items.some(it => it.kind === 'file')
  const html = e.clipboardData?.getData('text/html') || ''
  const hasImgs = /<img\b[^>]*src=/i.test(html)
  const hasDataURIs = /src=["']data:image\//i.test(html)

  // Находим наш блок категорий
  const categoryModal = document.querySelector('.category-wrap')

  if (hasFiles || hasDataURIs) {
    log('Вставлено зображення як файл/dataURL — все ок.')
    if (categoryModal) categoryModal.classList.add('_show') // Показываем
  } else if (hasImgs) {
    log('Вставлено зображення як URL — спробуємо завантажити.')
    if (categoryModal) categoryModal.classList.add('_show') // Показываем
  } else {
    log('Вставлено без зображень.')
    // Если нужно скрывать обратно при вставке текста без фото:
    if (categoryModal) categoryModal.classList.remove('_show')
  }
})

function updateCategoryVisibility() {
  const categoryModal = document.querySelector('.category-wrap')
  const hasImagesInEditor = editor.querySelectorAll('img').length > 0

  if (hasImagesInEditor) {
    categoryModal.classList.add('_show')
  } else {
    categoryModal.classList.remove('_show')
  }
}

// Отслеживаем любые изменения в редакторе (удаление/добавление картинок)
const observer = new MutationObserver(() => {
  updateCategoryVisibility()
})

observer.observe(editor, { childList: true, subtree: true })


document.addEventListener('DOMContentLoaded', () => {
  // --- Функция для восстановления категории из Storage ---
  const restoreCategory = () => {
    const savedCategory = localStorage.getItem('selectedCategory')
    if (savedCategory) {
      const targetBtn = Array.from(document.querySelectorAll('.category-wrap__link'))
        .find(btn => btn.querySelector('span').textContent.trim().toLowerCase() === savedCategory.toLowerCase())

      if (targetBtn) {
        const parent = targetBtn.closest('.category-wrap')
        const currentActive = parent.querySelector('._active')
        if (currentActive) currentActive.classList.remove('_active')

        targetBtn.classList.add('_active')

        // const categoryDisplay = document.querySelector('#category-name')
        // if (categoryDisplay) categoryDisplay.textContent = targetBtn.textContent.trim()
      }
    }
  }

  // Mini modal
  document.querySelectorAll('.mini-modal__btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault()
      const parent = btn.closest('.mini-modal')
      const modal = parent.querySelector('.mini-modal__modal')

      const isActive = btn.classList.contains('_active')

      document.querySelectorAll('.mini-modal__btn').forEach(b => b.classList.remove('_active'))
      document.querySelectorAll('.mini-modal__modal').forEach(m => m.classList.remove('_active'))

      if (isTouchDevice()) document.body.style.cursor = 'default'

      if (!isActive) {
        btn.classList.add('_active')
        if (modal) modal.classList.add('_active')

        if (isTouchDevice()) document.body.style.cursor = 'pointer'
      }
    })
  })

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.mini-modal')) {
      document.querySelectorAll('.mini-modal__modal, .mini-modal__btn').forEach(el => el.classList.remove('_active'))

      if (isTouchDevice()) document.body.style.cursor = 'default'
    }
  })

  // Категории - використовуємо делегування для динамічних кнопок
  // Категории - делегирование для динамических кнопок
  document.addEventListener('click', function (event) {
    const btn = event.target.closest('.category-wrap__link')
    if (btn) {
      event.preventDefault()

      const parent = btn.closest('.category-wrap')
      const isActive = btn.classList.contains('_active')

      if (!isActive) {
        // Знімаємо активний клас з усіх кнопок у групі
        parent.querySelectorAll('.category-wrap__link').forEach(b => b.classList.remove('_active'))

        // Додаємо активний клас до натиснутої кнопки
        btn.classList.add('_active')

        // Отримуємо текст кнопки та зберігаємо в localStorage
        const btnText = btn.textContent.trim().toLowerCase()
        localStorage.setItem('selectedCategory', btnText)

        console.log("Категорія збережена:", btnText)

        // Якщо потрібно, оновлюємо відображення категорії
        // const categoryDisplay = document.querySelector('#category-name')
        // if (categoryDisplay) categoryDisplay.textContent = btn.textContent.trim()
      }
    }
  })

  restoreCategory()

  // ENd Mini modal
})

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints
}

// Делегирование события клика
// document.addEventListener('click', function (event) {
//   if (event.target && event.target.classList.contains('category-wrap__link') ) {


//   }
// })


function colorizeNestedTags(container) {
  // Находим все элементы, которые Prism пометил как части тега
  const tokens = container.querySelectorAll('.token.tag')
  const colors = ['#50fa7b', '#8be9fd', '#bd93f9', '#ffb86c', '#ff5555']

  let depth = 0
  const selfClosing = ['br', 'img', 'hr', 'meta', 'link', 'input']

  // Временные переменные для обработки группы токенов одного тега
  let currentTagColor = ''
  let isClosing = false
  let tagName = ''

  tokens.forEach(token => {
    const text = token.textContent.trim().toLowerCase()

    // 1. Начало тега (символ < или </)
    if (text === '<' || text === '</') {
      isClosing = (text === '</')

      if (isClosing) {
        depth = Math.max(0, depth - 1)
      }

      currentTagColor = colors[depth % colors.length]
      token.style.setProperty('color', currentTagColor, 'important')
    }
    // 2. Имя тега (идет сразу после < или </)
    else if (text.match(/^[a-z0-9]+$/) && !tagName) {
      tagName = text
      token.style.setProperty('color', currentTagColor, 'important')

      // Если это открывающий тег и он НЕ самозакрывающийся — увеличиваем глубину
      if (!isClosing && !selfClosing.includes(tagName)) {
        // Мы увеличим depth только когда тег полностью закроется символом '>'
        // но цвет уже зафиксирован
      }
    }
    // 3. Конец тега (символ > или />)
    else if (text === '>' || text === '/>') {
      token.style.setProperty('color', currentTagColor, 'important')

      // Если это было открытие обычного тега, увеличиваем счетчик для вложенных элементов
      if (!isClosing && !selfClosing.includes(tagName) && text !== '/>') {
        depth++
      }

      // Сбрасываем флаги для следующего тега
      tagName = ''
      isClosing = false
    }
    // 4. Любые другие части внутри тега (атрибуты и т.д.)
    else {
      token.style.setProperty('color', currentTagColor, 'important')
    }
  })
}
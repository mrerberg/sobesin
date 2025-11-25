const ID = 'GTM-WCCZ5R4C'

export const Analytics = {
  Header: AnalyticsHeader,
  Body: AnalyticsBody
}

function AnalyticsHeader() {
  return (
    <>
      {/* Google Tag Manager */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${ID}');
          `
        }}
      />
    </>
  )
}

function AnalyticsBody() {
  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          title='gtag'
          src={`https://www.googletagmanager.com/ns.html?id=${ID}`}
          height='0'
          width='0'
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}

import { useSearchParams } from "react-router-dom"
import { yt_html } from "../assets/assets"


// This component basically preview the thumnail how it's looking inside the youtube

const YtPreview = () => {

  // UseSearchParms is the hook that reads the values from the url
  // It returs array with two values searchParams to read the values and setSearchParams to update the values
  const [SearchParams]=useSearchParams()

  // search the values of url and title
  const thumbnail_url=SearchParams.get('thumbnail_url')
  const title=SearchParams.get('title')

  // ! use this sign which denotes the value is not null or undefined
  const new_html=yt_html.replace("%%THUMBNAIL_URL%%",thumbnail_url!).replace("%%TITLE%%",title!)


  return (
    <div className='fixed inset-0 z-100 bg-black'>
      <iframe srcDoc={new_html} width="100%" height="100%" allowFullScreen>
      </iframe>
      </div>
  )
}

export default YtPreview

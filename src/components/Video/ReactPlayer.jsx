import ReactPlayer from "react-player"

const ReactPlayer = () => {
  const videoUrl = "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
  
  return (
     <ReactPlayer
        url={videoUrl}
        controls={true}
        width="100%"
        height="100%"
     />
  )
}

export default ReactPlayer
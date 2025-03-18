interface AuthImagePatternProps {
  title: string;
  subtitle: string;
}

//this is the component for the image pattern on the auth page

const AuthImagePattern = ({title, subtitle}: AuthImagePatternProps) => {   
    
    return (
        <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
        <div className="max-w-md text-center">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_, i) => ( //this is the image pattern and this is working by doing a loop of 9
              //and then creating a div with the class of aspect-square and rounded-2xl and bg-primary/10
              //and then checking if the index is even then add the class of animate-pulse
              //this will create a pulse effect on the even indexes
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-primary/10 ${
                  i % 2 === 0 ? "animate-pulse" : ""
                }`}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    )
}   

export default AuthImagePattern;
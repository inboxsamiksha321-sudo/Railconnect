import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, CATEGORIES } from "../../constants";
import {
  Mic,
  MicOff,
  Camera,
  Image,
  X,
  Send,
  Globe,
  Train,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";

const languages = [
  { code: "en-IN", label: "English" },
  { code: "hi-IN", label: "हिंदी (Hindi)" },
  { code: "mr-IN", label: "मराठी (Marathi)" },
  { code: "ta-IN", label: "தமிழ் (Tamil)" },
  { code: "te-IN", label: "తెలుగు (Telugu)" },
  { code: "kn-IN", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml-IN", label: "മലയാളം (Malayalam)" },
  { code: "gu-IN", label: "ગુજરાતી (Gujarati)" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "bn-IN", label: "বাংলা (Bengali)" },
  { code: "or-IN", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "as-IN", label: "অসমীয়া (Assamese)" },
  { code: "ur-IN", label: "اردو (Urdu)" },
  { code: "sa-IN", label: "संस्कृत (Sanskrit)" },
  { code: "ks-IN", label: "کٲشُر (Kashmiri)" },
  { code: "sd-IN", label: "سنڌي (Sindhi)" },
  { code: "ne-IN", label: "नेपाली (Nepali)" },
  { code: "mni-IN", label: "মৈতৈলোন্ (Manipuri)" },
  { code: "doi-IN", label: "डोगरी (Dogri)" },
  { code: "brx-IN", label: "बड़ो (Bodo)" },
  { code: "sat-IN", label: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" },
  { code: "mai-IN", label: "मैथिली (Maithili)" },
];

const FileComplaint = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const chunksRef = useRef([]);

  const [language, setLanguage] = useState("en-IN");
  const [description, setDescription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [pnr, setPnr] = useState("");
  const [coach, setCoach] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Speech to Text ────────────────────────────────────────
  const handleSpeech = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      toast("Stopped listening ✅");
      return;
    }
    const SR =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.msSpeechRecognition;
    if (!SR) {
      toast.error("Please use Google Chrome for voice input");
      return;
    }
    const recognition = new SR();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setIsListening(true);
      toast.success("Listening... click Stop to finish 🎤");
    };
    recognition.onresult = (e) => {
      const newText = Array.from(e.results)
        .slice(e.resultIndex)
        .map((r) => r[0].transcript)
        .join(" ");
      setDescription((prev) => (prev ? prev + " " + newText : newText));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error !== "aborted") toast.error("Microphone error!");
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // ── Voice Recording ───────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
  };

  // ── Camera ────────────────────────────────────────────────
  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      toast.error("Camera access denied");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (photos.length < 5) {
        setPhotos((prev) => [...prev, URL.createObjectURL(blob)]);
        setPhotoFiles((prev) => [
          ...prev,
          new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" }),
        ]);
        toast.success("Photo captured!");
      } else {
        toast.error("Max 5 photos allowed");
      }
    }, "image/jpeg");
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setShowCamera(false);
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      toast.error("Max 5 photos allowed");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
      setPhotoFiles((prev) => [...prev, file]);
    });
  };

  const removePhoto = (i) => {
    setPhotos(photos.filter((_, j) => j !== i));
    setPhotoFiles(photoFiles.filter((_, j) => j !== i));
  };

  const [trainNo, setTrainNo] = useState("");

  const handleSubmit = async () => {
    if (!description.trim() && !audioURL && photos.length === 0) {
      toast.error("Please add a description, voice recording, or photo");
      return;
    }

    if (!trainNo.trim()) {
      toast.error("Please enter train number");
      return;
    }

    setSubmitting(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const formData = new FormData();

      formData.append("train_no", trainNo);
      formData.append("text", description);

      formData.append("user_lat", position.coords.latitude);
      formData.append("user_long", position.coords.longitude);

      if (photoFiles.length > 0) {
        formData.append("file", photoFiles[0]);
      }

      const token = localStorage.getItem("railconnect_token");

      const res = await axios.post(
        `${API_BASE_URL}/submit-complaint`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("BACKEND RESPONSE:", res.data);

      toast.success("Complaint filed successfully!");

      navigate("/passenger/dashboard");
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.error || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-rail-bg py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-syne font-bold text-rail-blue text-2xl mb-1">
            File a Complaint
          </h1>
          <p className="text-rail-gray text-sm font-dm">
            Describe your issue — our AI will route it to the right department
          </p>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-rail-mid" />
            <h3 className="font-syne font-bold text-rail-blue">
              🇮🇳 Select Language
            </h3>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-dm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-rail-mid"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description + Speech */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-syne font-bold text-rail-blue">
              Complaint Description
            </h3>
            <button
              onClick={handleSpeech}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-dm font-medium transition-all ${
                isListening
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-rail-light text-rail-mid hover:bg-blue-100"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" /> Stop
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Speak
                </>
              )}
            </button>
          </div>
          {isListening && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-50 rounded-xl">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-600 font-dm">
                Listening in {languages.find((l) => l.code === language)?.label}
                ... click Stop when done
              </span>
            </div>
          )}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your complaint... or use the Speak button above"
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-dm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-rail-mid resize-none"
          />
          <p className="text-xs text-rail-gray font-dm mt-1">
            {description.length} characters
          </p>
        </div>

        {/* Voice Recording */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h3 className="font-syne font-bold text-rail-blue mb-3">
            Voice Recording (Proof)
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 bg-rail-blue hover:bg-rail-mid text-white px-4 py-2.5 rounded-xl text-sm font-dm font-medium transition-all"
              >
                <Mic className="w-4 h-4" /> Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-dm font-medium animate-pulse"
              >
                <MicOff className="w-4 h-4" /> Stop Recording
              </button>
            )}
            {audioURL && (
              <audio controls src={audioURL} className="flex-1 h-10" />
            )}
          </div>
        </div>

        {/* Photo Evidence */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h3 className="font-syne font-bold text-rail-blue mb-3">
            Photo Evidence{" "}
            <span className="text-rail-gray text-xs font-dm font-normal">
              (max 5)
            </span>
          </h3>
          <div className="flex gap-3 mb-4">
            <button
              onClick={openCamera}
              className="flex items-center gap-2 bg-rail-light text-rail-mid hover:bg-blue-100 px-4 py-2.5 rounded-xl text-sm font-dm font-medium transition-all"
            >
              <Camera className="w-4 h-4" /> Camera
            </button>
            <label className="flex items-center gap-2 bg-rail-light text-rail-mid hover:bg-blue-100 px-4 py-2.5 rounded-xl text-sm font-dm font-medium transition-all cursor-pointer">
              <Image className="w-4 h-4" /> Gallery
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGallery}
                className="hidden"
              />
            </label>
          </div>
          {photos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {photos.map((photo, i) => (
                <div key={i} className="relative">
                  <img
                    src={photo}
                    alt=""
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Journey Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h3 className="font-syne font-bold text-rail-blue mb-3">
            Journey Details{" "}
            <span className="text-rail-gray text-xs font-dm font-normal">
              (optional)
            </span>
          </h3>
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 block mb-1.5">
              Train Number
            </label>

            <input
              type="text"
              value={trainNo}
              onChange={(e) => setTrainNo(e.target.value)}
              placeholder="Enter train number"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                PNR Number
              </label>
              <div className="relative">
                <Train className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
                <input
                  type="text"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  placeholder="10-digit PNR"
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Coach Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
                <input
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  placeholder="e.g. S4, B2"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 bg-rail-blue hover:bg-rail-mid text-white font-dm font-semibold py-4 rounded-2xl transition-all disabled:opacity-50"
        >
          {submitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {submitting ? "Filing Complaint..." : "Submit Complaint"}
        </button>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-lg rounded-2xl"
          />
          <div className="flex gap-4 mt-6">
            <button
              onClick={capturePhoto}
              className="bg-white text-rail-blue font-dm font-semibold px-8 py-3 rounded-2xl"
            >
              📸 Capture
            </button>
            <button
              onClick={closeCamera}
              className="bg-red-500 text-white font-dm font-semibold px-8 py-3 rounded-2xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileComplaint;

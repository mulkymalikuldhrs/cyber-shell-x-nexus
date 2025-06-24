package com.cybershellx.assistant

import android.app.*
import android.content.Intent
import android.os.IBinder
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import androidx.core.app.NotificationCompat
import org.java_websocket.client.WebSocketClient
import org.java_websocket.handshake.ServerHandshake
import org.json.JSONObject
import java.net.URI
import java.util.*

class CyberShellXService : Service(), TextToSpeech.OnInitListener {
    
    private var speechRecognizer: SpeechRecognizer? = null
    private var textToSpeech: TextToSpeech? = null
    private var webSocketClient: WebSocketClient? = null
    private var isListening = false
    
    companion object {
        const val CHANNEL_ID = "CyberShellXChannel"
        const val NOTIFICATION_ID = 1
    }
    
    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        textToSpeech = TextToSpeech(this, this)
        initializeWebSocket()
        startForegroundService()
    }
    
    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "CyberShellX Assistant",
            NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = "Voice assistant running in background"
        }
        
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.createNotificationChannel(channel)
    }
    
    private fun startForegroundService() {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("CyberShellX Assistant")
            .setContentText("Listening for 'Hey CyberShell'...")
            .setSmallIcon(R.drawable.ic_mic)
            .setOngoing(true)
            .build()
        
        startForeground(NOTIFICATION_ID, notification)
    }
    
    private fun initializeWebSocket() {
        val uri = URI("ws://localhost:8765")
        webSocketClient = object : WebSocketClient(uri) {
            override fun onOpen(handshake: ServerHandshake?) {
                // Connected to CyberShellX server
            }
            
            override fun onMessage(message: String?) {
                message?.let {
                    try {
                        val json = JSONObject(it)
                        val response = json.getString("output")
                        speak(response)
                    } catch (e: Exception) {
                        speak("Command executed")
                    }
                }
            }
            
            override fun onClose(code: Int, reason: String?, remote: Boolean) {
                // Reconnect after delay
                android.os.Handler(mainLooper).postDelayed({
                    connect()
                }, 5000)
            }
            
            override fun onError(ex: Exception?) {
                // Handle connection errors
            }
        }
        webSocketClient?.connect()
    }
    
    private fun initializeSpeechRecognizer() {
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this)
        speechRecognizer?.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                isListening = true
                updateNotification("Listening...")
            }
            
            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            
            override fun onEndOfSpeech() {
                isListening = false
                updateNotification("Processing...")
            }
            
            override fun onError(error: Int) {
                isListening = false
                updateNotification("Listening for 'Hey CyberShell'...")
                restartListening()
            }
            
            override fun onResults(results: Bundle?) {
                val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                matches?.let {
                    processSpeechResult(it[0])
                }
                isListening = false
                restartListening()
            }
            
            override fun onPartialResults(partialResults: Bundle?) {}
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })
    }
    
    private fun startListening() {
        if (!isListening && speechRecognizer != null) {
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
                putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, packageName)
            }
            speechRecognizer?.startListening(intent)
        }
    }
    
    private fun restartListening() {
        android.os.Handler(mainLooper).postDelayed({
            startListening()
        }, 2000)
    }
    
    private fun processSpeechResult(spokenText: String) {
        val lowerText = spokenText.lowercase()
        
        if (lowerText.contains("hey cybershell") || lowerText.contains("cybershell")) {
            updateNotification("Activated! Listening for command...")
            speak("Yes, how can I help you?")
            
            // Wait for command
            android.os.Handler(mainLooper).postDelayed({
                startListening()
            }, 3000)
        } else {
            // Process command
            processCommand(spokenText)
        }
    }
    
    private fun processCommand(command: String) {
        updateNotification("Executing: $command")
        
        val json = JSONObject().apply {
            put("command", command)
            put("timestamp", System.currentTimeMillis())
        }
        
        webSocketClient?.send(json.toString())
    }
    
    private fun speak(text: String) {
        textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
    }
    
    private fun updateNotification(text: String) {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("CyberShellX Assistant")
            .setContentText(text)
            .setSmallIcon(R.drawable.ic_mic)
            .setOngoing(true)
            .build()
        
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.notify(NOTIFICATION_ID, notification)
    }
    
    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            textToSpeech?.language = Locale.US
            initializeSpeechRecognizer()
            startListening()
        }
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
    
    override fun onDestroy() {
        super.onDestroy()
        speechRecognizer?.destroy()
        textToSpeech?.shutdown()
        webSocketClient?.close()
    }
}
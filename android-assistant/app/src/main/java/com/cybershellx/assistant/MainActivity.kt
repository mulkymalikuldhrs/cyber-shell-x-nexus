package com.cybershellx.assistant

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import kotlinx.coroutines.delay
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.util.*

class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {
    
    private var speechRecognizer: SpeechRecognizer? = null
    private var textToSpeech: TextToSpeech? = null
    private var isListening = mutableStateOf(false)
    private var responseText = mutableStateOf("Say 'Hey CyberShell' to activate")
    private var isActive = mutableStateOf(false)
    private val client = OkHttpClient()
    
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            initializeSpeechRecognizer()
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        textToSpeech = TextToSpeech(this, this)
        
        setContent {
            CyberShellXAssistantUI()
        }
        
        checkMicrophonePermission()
    }
    
    @Composable
    fun CyberShellXAssistantUI() {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // CyberShellX Logo/Title
            Text(
                text = "CyberShellX",
                color = Color.Cyan,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold
            )
            
            Text(
                text = "AI Assistant",
                color = Color.White,
                fontSize = 18.sp,
                modifier = Modifier.padding(bottom = 48.dp)
            )
            
            // Voice Indicator
            Box(
                modifier = Modifier
                    .size(120.dp)
                    .clip(CircleShape)
                    .background(
                        if (isListening.value) Color.Red.copy(alpha = 0.7f)
                        else if (isActive.value) Color.Cyan.copy(alpha = 0.7f)
                        else Color.Gray.copy(alpha = 0.3f)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (isListening.value) Icons.Default.Mic else Icons.Default.MicOff,
                    contentDescription = "Microphone",
                    tint = Color.White,
                    modifier = Modifier.size(48.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(32.dp))
            
            // Status Text
            Text(
                text = responseText.value,
                color = Color.White,
                fontSize = 16.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 24.dp)
            )
            
            Spacer(modifier = Modifier.height(48.dp))
            
            // Manual Activation Button
            Button(
                onClick = { startListening() },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.Cyan,
                    contentColor = Color.Black
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Tap to Speak", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Toggle Always Listening
            Button(
                onClick = { toggleAlwaysListening() },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isActive.value) Color.Red else Color.Green,
                    contentColor = Color.White
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    if (isActive.value) "Stop Always Listening" else "Start Always Listening",
                    fontSize = 16.sp
                )
            }
        }
    }
    
    private fun checkMicrophonePermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) 
            != PackageManager.PERMISSION_GRANTED) {
            requestPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        } else {
            initializeSpeechRecognizer()
        }
    }
    
    private fun initializeSpeechRecognizer() {
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this)
        speechRecognizer?.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                isListening.value = true
            }
            
            override fun onBeginningOfSpeech() {}
            
            override fun onRmsChanged(rmsdB: Float) {}
            
            override fun onBufferReceived(buffer: ByteArray?) {}
            
            override fun onEndOfSpeech() {
                isListening.value = false
            }
            
            override fun onError(error: Int) {
                isListening.value = false
                if (isActive.value) {
                    // Restart listening for wake word
                    startContinuousListening()
                }
            }
            
            override fun onResults(results: Bundle?) {
                val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                matches?.let { 
                    processSpeechResult(it[0])
                }
                isListening.value = false
                
                if (isActive.value) {
                    // Restart listening for wake word
                    startContinuousListening()
                }
            }
            
            override fun onPartialResults(partialResults: Bundle?) {}
            
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })
    }
    
    private fun startListening() {
        if (!isListening.value) {
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
                putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            }
            speechRecognizer?.startListening(intent)
        }
    }
    
    private fun startContinuousListening() {
        if (isActive.value && !isListening.value) {
            kotlinx.coroutines.GlobalScope.launch {
                delay(1000) // Small delay before restarting
                runOnUiThread {
                    startListening()
                }
            }
        }
    }
    
    private fun toggleAlwaysListening() {
        isActive.value = !isActive.value
        
        if (isActive.value) {
            responseText.value = "Listening for 'Hey CyberShell'..."
            startContinuousListening()
        } else {
            responseText.value = "Say 'Hey CyberShell' to activate"
            speechRecognizer?.stopListening()
        }
    }
    
    private fun processSpeechResult(spokenText: String) {
        val lowerText = spokenText.lowercase()
        
        if (lowerText.contains("hey cybershell") || lowerText.contains("cybershell")) {
            responseText.value = "Yes, how can I help you?"
            speak("Yes, how can I help you?")
            
            // Wait for command after wake word
            kotlinx.coroutines.GlobalScope.launch {
                delay(2000)
                runOnUiThread {
                    responseText.value = "Listening for your command..."
                    startListening()
                }
            }
        } else if (isActive.value) {
            // Process the actual command
            processCommand(spokenText)
        }
    }
    
    private fun processCommand(command: String) {
        responseText.value = "Processing: $command"
        
        // Send command to CyberShellX server
        val json = JSONObject().apply {
            put("command", command)
            put("timestamp", System.currentTimeMillis())
        }
        
        val requestBody = json.toString().toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url("ws://localhost:8765") // Your WebSocket server
            .post(requestBody)
            .build()
        
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    val response = "I'm having trouble connecting to the CyberShellX server. Please check if it's running."
                    responseText.value = response
                    speak(response)
                }
            }
            
            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string()
                runOnUiThread {
                    val reply = "Command executed: $command"
                    responseText.value = reply
                    speak(reply)
                }
            }
        })
    }
    
    private fun speak(text: String) {
        textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
    }
    
    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            textToSpeech?.language = Locale.US
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        speechRecognizer?.destroy()
        textToSpeech?.shutdown()
    }
}
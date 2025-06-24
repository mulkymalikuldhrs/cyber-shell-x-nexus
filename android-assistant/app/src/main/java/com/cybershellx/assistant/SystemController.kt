package com.cybershellx.assistant

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.camera2.CameraAccessException
import android.hardware.camera2.CameraManager
import android.net.ConnectivityManager
import android.net.wifi.WifiManager
import android.os.Build
import android.provider.Settings
import android.util.Log
import androidx.core.content.ContextCompat
import java.io.IOException

class SystemController(private val context: Context) {
    
    private val wifiManager: WifiManager by lazy {
        context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
    }
    
    private val cameraManager: CameraManager by lazy {
        context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    }
    
    private val connectivityManager: ConnectivityManager by lazy {
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    }
    
    private val bluetoothManager: BluetoothManager by lazy {
        context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    }
    
    private var isFlashlightOn = false
    private var cameraId: String? = null
    
    init {
        try {
            cameraId = cameraManager.cameraIdList.firstOrNull()
        } catch (e: CameraAccessException) {
            Log.e("SystemController", "Error accessing camera", e)
        }
    }
    
    // WiFi Control
    fun toggleWifi(): String {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10+ requires user interaction for WiFi toggle
                val intent = Intent(Settings.Panel.ACTION_WIFI)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                context.startActivity(intent)
                "WiFi settings opened. Please toggle manually on Android 10+"
            } else {
                @Suppress("DEPRECATION")
                val currentState = wifiManager.isWifiEnabled
                @Suppress("DEPRECATION")
                wifiManager.isWifiEnabled = !currentState
                if (currentState) "WiFi disabled" else "WiFi enabled"
            }
        } catch (e: Exception) {
            "Error controlling WiFi: ${e.message}"
        }
    }
    
    fun getWifiStatus(): String {
        return try {
            val isEnabled = wifiManager.isWifiEnabled
            val connectionInfo = wifiManager.connectionInfo
            val ssid = connectionInfo?.ssid?.replace("\"", "") ?: "Unknown"
            val signalStrength = connectionInfo?.rssi ?: 0
            
            if (isEnabled) {
                if (ssid != "Unknown" && ssid != "<unknown ssid>") {
                    "WiFi: Connected to $ssid (Signal: ${signalStrength}dBm)"
                } else {
                    "WiFi: Enabled but not connected"
                }
            } else {
                "WiFi: Disabled"
            }
        } catch (e: Exception) {
            "Error reading WiFi status: ${e.message}"
        }
    }
    
    // Flashlight Control
    fun toggleFlashlight(): String {
        return try {
            if (cameraId == null) {
                return "No camera available for flashlight"
            }
            
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) 
                != PackageManager.PERMISSION_GRANTED) {
                return "Camera permission required for flashlight"
            }
            
            cameraManager.setTorchMode(cameraId!!, !isFlashlightOn)
            isFlashlightOn = !isFlashlightOn
            
            if (isFlashlightOn) "Flashlight ON" else "Flashlight OFF"
        } catch (e: CameraAccessException) {
            "Error controlling flashlight: ${e.message}"
        }
    }
    
    fun getFlashlightStatus(): String {
        return if (isFlashlightOn) "Flashlight: ON" else "Flashlight: OFF"
    }
    
    // Bluetooth Control
    fun toggleBluetooth(): String {
        return try {
            val bluetoothAdapter = bluetoothManager.adapter
            
            if (bluetoothAdapter == null) {
                return "Bluetooth not supported on this device"
            }
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                // Android 12+ requires user interaction
                val intent = if (bluetoothAdapter.isEnabled) {
                    Intent(BluetoothAdapter.ACTION_REQUEST_DISABLE)
                } else {
                    Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
                }
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                context.startActivity(intent)
                "Bluetooth toggle request sent"
            } else {
                @Suppress("DEPRECATION")
                if (bluetoothAdapter.isEnabled) {
                    @Suppress("DEPRECATION")
                    bluetoothAdapter.disable()
                    "Bluetooth disabled"
                } else {
                    @Suppress("DEPRECATION")
                    bluetoothAdapter.enable()
                    "Bluetooth enabled"
                }
            }
        } catch (e: Exception) {
            "Error controlling Bluetooth: ${e.message}"
        }
    }
    
    fun getBluetoothStatus(): String {
        return try {
            val bluetoothAdapter = bluetoothManager.adapter
            if (bluetoothAdapter == null) {
                "Bluetooth: Not supported"
            } else {
                val state = when (bluetoothAdapter.state) {
                    BluetoothAdapter.STATE_ON -> "ON"
                    BluetoothAdapter.STATE_OFF -> "OFF"
                    BluetoothAdapter.STATE_TURNING_ON -> "Turning ON"
                    BluetoothAdapter.STATE_TURNING_OFF -> "Turning OFF"
                    else -> "Unknown"
                }
                "Bluetooth: $state"
            }
        } catch (e: Exception) {
            "Error reading Bluetooth status: ${e.message}"
        }
    }
    
    // Screen Brightness Control
    fun setBrightness(level: Int): String {
        return try {
            if (level < 0 || level > 100) {
                return "Brightness level must be between 0-100"
            }
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.System.canWrite(context)) {
                    val intent = Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                    context.startActivity(intent)
                    return "Please grant write settings permission first"
                }
            }
            
            val brightnessValue = (level * 255) / 100
            Settings.System.putInt(
                context.contentResolver,
                Settings.System.SCREEN_BRIGHTNESS,
                brightnessValue
            )
            "Screen brightness set to $level%"
        } catch (e: Exception) {
            "Error setting brightness: ${e.message}"
        }
    }
    
    fun getBrightness(): String {
        return try {
            val brightness = Settings.System.getInt(
                context.contentResolver,
                Settings.System.SCREEN_BRIGHTNESS
            )
            val percentage = (brightness * 100) / 255
            "Screen brightness: $percentage%"
        } catch (e: Exception) {
            "Error reading brightness: ${e.message}"
        }
    }
    
    // Network Information
    fun getNetworkInfo(): String {
        return try {
            val activeNetwork = connectivityManager.activeNetworkInfo
            if (activeNetwork?.isConnected == true) {
                val type = when (activeNetwork.type) {
                    ConnectivityManager.TYPE_WIFI -> "WiFi"
                    ConnectivityManager.TYPE_MOBILE -> "Mobile Data"
                    ConnectivityManager.TYPE_ETHERNET -> "Ethernet"
                    else -> "Unknown"
                }
                "Network: Connected via $type"
            } else {
                "Network: Disconnected"
            }
        } catch (e: Exception) {
            "Error reading network info: ${e.message}"
        }
    }
    
    // Volume Control
    fun setVolume(type: String, level: Int): String {
        return try {
            if (level < 0 || level > 100) {
                return "Volume level must be between 0-100"
            }
            
            val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as android.media.AudioManager
            
            val streamType = when (type.lowercase()) {
                "media", "music" -> android.media.AudioManager.STREAM_MUSIC
                "ring", "ringtone" -> android.media.AudioManager.STREAM_RING
                "alarm" -> android.media.AudioManager.STREAM_ALARM
                "notification" -> android.media.AudioManager.STREAM_NOTIFICATION
                "call" -> android.media.AudioManager.STREAM_VOICE_CALL
                else -> android.media.AudioManager.STREAM_MUSIC
            }
            
            val maxVolume = audioManager.getStreamMaxVolume(streamType)
            val targetVolume = (level * maxVolume) / 100
            
            audioManager.setStreamVolume(streamType, targetVolume, 0)
            "$type volume set to $level%"
        } catch (e: Exception) {
            "Error setting volume: ${e.message}"
        }
    }
    
    // System Information
    fun getSystemInfo(): String {
        return try {
            val batteryLevel = getBatteryLevel()
            val storageInfo = getStorageInfo()
            val memoryInfo = getMemoryInfo()
            
            """
            System Information:
            • Android: ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})
            • Device: ${Build.MANUFACTURER} ${Build.MODEL}
            • Battery: $batteryLevel
            • Storage: $storageInfo
            • Memory: $memoryInfo
            • ${getNetworkInfo()}
            • ${getWifiStatus()}
            • ${getBluetoothStatus()}
            """.trimIndent()
        } catch (e: Exception) {
            "Error getting system info: ${e.message}"
        }
    }
    
    private fun getBatteryLevel(): String {
        return try {
            val batteryIntent = context.registerReceiver(null, 
                android.content.IntentFilter(Intent.ACTION_BATTERY_CHANGED))
            val level = batteryIntent?.getIntExtra(android.os.BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale = batteryIntent?.getIntExtra(android.os.BatteryManager.EXTRA_SCALE, -1) ?: -1
            
            if (level >= 0 && scale > 0) {
                val percentage = (level * 100) / scale
                "$percentage%"
            } else {
                "Unknown"
            }
        } catch (e: Exception) {
            "Unknown"
        }
    }
    
    private fun getStorageInfo(): String {
        return try {
            val stat = android.os.StatFs(android.os.Environment.getDataDirectory().path)
            val totalBytes = stat.blockSizeLong * stat.blockCountLong
            val availableBytes = stat.blockSizeLong * stat.availableBlocksLong
            
            val totalGB = totalBytes / (1024 * 1024 * 1024)
            val availableGB = availableBytes / (1024 * 1024 * 1024)
            
            "${availableGB}GB / ${totalGB}GB available"
        } catch (e: Exception) {
            "Unknown"
        }
    }
    
    private fun getMemoryInfo(): String {
        return try {
            val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as android.app.ActivityManager
            val memInfo = android.app.ActivityManager.MemoryInfo()
            activityManager.getMemoryInfo(memInfo)
            
            val availableMB = memInfo.availMem / (1024 * 1024)
            val totalMB = memInfo.totalMem / (1024 * 1024)
            
            "${availableMB}MB / ${totalMB}MB available"
        } catch (e: Exception) {
            "Unknown"
        }
    }
    
    // Execute shell commands (requires root)
    fun executeShellCommand(command: String): String {
        return try {
            val process = Runtime.getRuntime().exec(command)
            val output = process.inputStream.bufferedReader().readText()
            val error = process.errorStream.bufferedReader().readText()
            
            process.waitFor()
            
            if (error.isNotEmpty()) {
                "Error: $error"
            } else if (output.isNotEmpty()) {
                "Output: $output"
            } else {
                "Command executed successfully"
            }
        } catch (e: IOException) {
            "Error executing command: ${e.message}"
        } catch (e: InterruptedException) {
            "Command interrupted: ${e.message}"
        }
    }
}
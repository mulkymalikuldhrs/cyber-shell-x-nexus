package com.cybershellx.assistant

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class AboutActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AboutScreen {
                finish()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AboutScreen(onBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Start
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = Color.White
                )
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // App Logo/Title
        Text(
            text = "CyberShellX",
            color = Color.Cyan,
            fontSize = 36.sp,
            fontWeight = FontWeight.Bold
        )
        
        Text(
            text = "AI Assistant",
            color = Color.White,
            fontSize = 20.sp,
            modifier = Modifier.padding(bottom = 32.dp)
        )
        
        // Creator Information
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = Color.Gray.copy(alpha = 0.2f)
            )
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Created by",
                    color = Color.Gray,
                    fontSize = 16.sp
                )
                
                Text(
                    text = "Mulky Malikul Dhaher",
                    color = Color.Cyan,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
                
                Text(
                    text = "Cybersecurity Expert & AI Developer",
                    color = Color.White,
                    fontSize = 16.sp,
                    textAlign = TextAlign.Center
                )
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // App Information
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = Color.Gray.copy(alpha = 0.2f)
            )
        ) {
            Column(
                modifier = Modifier.padding(24.dp)
            ) {
                Text(
                    text = "App Information",
                    color = Color.Cyan,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
                
                InfoRow("Version", "1.0.0")
                InfoRow("Build", "2024.12")
                InfoRow("Platform", "Android 7.0+")
                InfoRow("Wake Word", "Hey CyberShell")
                InfoRow("License", "MIT License")
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = "A sophisticated AI assistant for cybersecurity professionals, featuring voice commands, real-time analysis, and comprehensive security tools integration.",
                    color = Color.Gray,
                    fontSize = 14.sp,
                    textAlign = TextAlign.Justify
                )
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Copyright
        Text(
            text = "© 2024 Mulky Malikul Dhaher\nAll rights reserved",
            color = Color.Gray,
            fontSize = 12.sp,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            color = Color.White,
            fontSize = 14.sp
        )
        Text(
            text = value,
            color = Color.Cyan,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium
        )
    }
}
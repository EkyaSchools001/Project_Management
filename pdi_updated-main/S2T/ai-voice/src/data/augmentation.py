import numpy as np
import librosa
import random
import torch

class AudioAugmenter:
    """
    Performs on-the-fly audio augmentation including speed perturbation
    and noise injection simulating classroom environments.
    """
    def __init__(self, sample_rate=16000):
        self.sample_rate = sample_rate
        
    def speed_perturb(self, audio_array: np.ndarray, speed_factor: float = None) -> np.ndarray:
        """
        Changes the speed of the audio without changing the pitch.
        speed_factor normally between 0.9 and 1.1
        """
        if speed_factor is None:
            speed_factor = random.choice([0.9, 1.0, 1.1])
            
        if speed_factor == 1.0:
            return audio_array
            
        # Librosa time stretch
        return librosa.effects.time_stretch(audio_array, rate=speed_factor)
        
    def add_gaussian_noise(self, audio_array: np.ndarray, snr_db: float = 15.0) -> np.ndarray:
        """
        Adds white noise at a specific Signal-to-Noise Ratio (SNR).
        """
        audio_power = np.mean(audio_array ** 2)
        noise_power = audio_power / (10 ** (snr_db / 10.0))
        noise = np.random.normal(0, np.sqrt(noise_power), len(audio_array))
        return audio_array + noise

    def apply_augmentations(self, audio_array: np.ndarray, apply_prob: float = 0.5) -> np.ndarray:
        """
        Randomly applies all augmentations.
        """
        audio_array = np.array(audio_array, dtype=np.float32)
        augmented = audio_array.copy()
        
        if random.random() < apply_prob:
            augmented = self.speed_perturb(augmented)
            
        if random.random() < apply_prob:
            # Simulate moderate classroom noise
            snr = random.uniform(10.0, 25.0)
            augmented = self.add_gaussian_noise(augmented, snr_db=snr)
            
        return augmented

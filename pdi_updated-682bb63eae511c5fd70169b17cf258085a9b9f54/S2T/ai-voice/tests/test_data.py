import unittest
import numpy as np
from src.data.normalization import EducationNormalizer
from src.data.augmentation import AudioAugmenter

class TestDataPipeline(unittest.TestCase):

    def setUp(self):
        self.normalizer = EducationNormalizer()
        self.augmenter = AudioAugmenter(sample_rate=16000)

    def test_normalization_abbreviations(self):
        text = "I study at MIT and taking CS exams"
        normalized = self.normalizer.normalize(text)
        self.assertEqual(normalized, "i study at m i t and taking computer science exams")

    def test_normalization_symbols(self):
        text = "The error rate is < 5%"
        normalized = self.normalizer.normalize(text)
        self.assertEqual(normalized, "the error rate is less than 5 percent")

    def test_augmentation_noise_shape(self):
        # Create a dummy 1-second audio array at 16kHz
        dummy_audio = np.random.randn(16000).astype(np.float32)
        noised_audio = self.augmenter.add_gaussian_noise(dummy_audio, snr_db=15.0)
        
        # Array size shouldn't change
        self.assertEqual(len(noised_audio), 16000)
        # It shouldn't be exactly the same (noise was added)
        self.assertFalse(np.array_equal(dummy_audio, noised_audio))

if __name__ == '__main__':
    unittest.main()

<?php

namespace Pstenstrm;

class Markdown extends \Michelf\Markdown {
	public $rimd_class = 'rimd_img';

	protected $rimd_noscript_suffix = "</noscript></i>";

	protected function _doImages_inline_callback($matches) {
		$url = $matches[3] == '' ? $matches[4] : $matches[3];
		$url = $this->encodeAttribute($url);

		$prefix = $this->rimd_noscript_prefix($url);

		$result = $this->hashPart($prefix);
		$result .= parent::_doImages_inline_callback($matches);
		$result .= $this->hashPart($this->rimd_noscript_suffix);

		return $result;
	}

	protected function _doImages_reference_callback($matches) {
		$whole_match = $matches[1];
		$link_id     = strtolower($matches[3]);

		if (isset($this->urls[$link_id])) {
			$url = $this->encodeAttribute($this->urls[$link_id]);
			$prefix = $this->rimd_noscript_prefix($url);

			$result = $this->hashPart($prefix);
			$result .= parent::_doImages_reference_callback($matches);
			$result .= $this->hashPart($this->rimd_noscript_suffix);
		} else {
			# If there's no such link ID, leave intact:
			$result = $whole_match;
		}

		return $result;
	}

	protected function rimd_noscript_prefix($url) {
		$padding = $this->rimd_get_image_ratio($url);

		$result = "<i class=\"$this->rimd_class\"";
		$result .= " style=\"padding-bottom:$padding%;\"";
		$result .= ">";
		$result .= "<noscript>";

		return $result;
	}

	protected function rimd_get_image_ratio($url) {
		$dimensions = getimagesize($url);
		$width = $dimensions[0];
		$height = $dimensions[1];

		return ($height / $width) * 100;
	}
}

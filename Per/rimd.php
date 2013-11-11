<?php

namespace Per;

class Rimd extends \Michelf\Markdown {
	public $noscript_suffix = "</noscript></i>";

	protected function _doImages_inline_callback($matches) {
		$whole_match	= $matches[1];
		$alt_text		= $matches[2];
		$url			= $matches[3] == '' ? $matches[4] : $matches[3];
		$title			=& $matches[7];

		$alt_text = $this->encodeAttribute($alt_text);
		$url = $this->encodeAttribute($url);

		# mod
		$result = $this->noscript_prefix($url);
		# @end mod

		$result .= "<img src=\"$url\" alt=\"$alt_text\"";
		if (isset($title)) {
			$title = $this->encodeAttribute($title);
			$result .=  " title=\"$title\""; # $title already quoted
		}
		$result .= $this->empty_element_suffix;

		# mod
		$result .= $this->noscript_suffix;
		# @end mod

		return $this->hashPart($result);
	}

	protected function _doImages_reference_callback($matches) {
		$whole_match = $matches[1];
		$alt_text    = $matches[2];
		$link_id     = strtolower($matches[3]);

		if ($link_id == "") {
			$link_id = strtolower($alt_text); # for shortcut links like ![this][].
		}

		$alt_text = $this->encodeAttribute($alt_text);
		if (isset($this->urls[$link_id])) {
			$url = $this->encodeAttribute($this->urls[$link_id]);
			# mod
			$result = $this->noscript_prefix($url);
			# @end mod
			$result .= "<img src=\"$url\" alt=\"$alt_text\"";
			if (isset($this->titles[$link_id])) {
				$title = $this->titles[$link_id];
				$title = $this->encodeAttribute($title);
				$result .=  " title=\"$title\"";
			}
			$result .= $this->empty_element_suffix;
			# mod
			$result .= $this->noscript_suffix;
			# @end mod
			$result = $this->hashPart($result);
		}
		else {
			# If there's no such link ID, leave intact:
			$result = $whole_match;
		}

		return $result;
	}

	protected function noscript_prefix($url) {
		$result = "<i class=\"rimd_img\"";
		$padding = $this->get_image_ratio($url);
		$result .= " style=\"padding-bottom:$padding%;\"";
		$result .= ">";
		
		$result .= "<noscript>";
		return $result;
	}

	protected function get_image_ratio($url) {
		$dimensions = getimagesize($url);
		$width = $dimensions[0];
		$height = $dimensions[1];

		return ($height / $width) * 100;
	}
}
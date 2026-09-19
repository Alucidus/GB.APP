# cf130 - Complete iris recolouring

The original tint excluded very dark pixels and blended their original colour back in. Dark upper iris shading could remain brown. Iris pigment now receives the selected hue throughout the shading, while neutral pupils and bright catchlights remain unchanged.

Female faces 3 and 4 now have individually fitted iris centres and ellipse dimensions. Male face 1 has an interior boundary mask because its source cutouts include a few pixels outside the iris rim. Other face geometry is unchanged. Original still restores the original eye colour, and saved pilot appearance values remain compatible.

Validation: 33 focused iris checks across all eight faces, checking removal of brown pigment, unchanged pupils/highlights and male face 1 boundary samples. Magnified screenshots of female 3, female 4 and male 1 were inspected. The existing 256 appearance/iris-isolation checks also passed. Chrome coverage; physical Safari not tested.

Quick test: select female face 3, female face 4 and male face 1. Try Blue, Green and Violet eyes. Check the entire iris, particularly its upper shadow, and check the eye whites remain clean. Select Original to restore the source colour.

Build and offline cache: cf130. No deployment.

###
 # @Author: szx
 # @Date: 2021-08-10 23:40:11
 # @LastEditTime: 2021-08-10 23:40:36
 # @Description: 替换wp-includes/class-wp-xmlrpc-server.php
 # 需要把文件放到wordpress下执行
 # @FilePath: \push-markdown\docs\change.sh
### 
path=wp-includes/class-wp-xmlrpc-server.php
text1='$bits = $data'
text2='#$bits = $data'
text3='\t\t$bits = base64_decode($data['\'bits\'']);'
text4='$upload_err = apply_filters'
text5='\t\tif ( !empty($data['\'overwrite\'']) && ($data['\'overwrite\''] == true) ) {\n\t\t\t$old_file = $wpdb->get_row("SELECT ID FROM {$wpdb->posts} WHERE post_title = '\'{$name}\'' AND post_type = '\'attachment\'' "); \n\t\t\twp_delete_attachment($old_file->ID);\n\t\t}'

sed -i '/'"$text1"'/a\'"$text3"'' $path
sed -i 's/'"$text1"'/'"$text2"'/' $path
sed -i '/'"$text4"'/i\'"$text5"'' $path
